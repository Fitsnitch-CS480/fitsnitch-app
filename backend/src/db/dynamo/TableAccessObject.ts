import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

const dynamoClient = new DynamoDB({ 
    region: 'us-west-2' 
})

/**
 * Valid comparison operators for querying SortKeys
 */
export enum SortOp {
    EQUALS = "=",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    MORE_THAN = ">",
    MORE_THAN_OR_EQUAL = ">=",
    BETWEEN = "BETWEEN",
    BEGINS_WITH = "BEGINS_WITH"
}

const PK_TOKEN = ":PK";
const S1_TOKEN = ":S1";
const S2_TOKEN = ":S2";

/**
 * Provides abstracted methods for making typical types of operations
 * on a DynamoDB Table where `T` represents the expected model for all rows
 */
export default class TableAccessObject<T> {
    /**
     * @param name The name of the table EXACTLY as it appears in AWS
     * @param primaryKey The primary key for the table
     * @param sortKey The sort key for the table, if applicable
     */
    constructor(public name:string, public primaryKey:string, public sortKey?: string) {}

    /**
     * Creates a new row with the provided data.
     * NOTE: If the keys for the new data match a row that already exists,
     * the previous row will simply be entirely replaced!
     * 
     * @param data The data for the new row
     */
    async createOrUpdate(data:T): Promise<void> {
        let item = {};
        for (let [key, val] of Object.entries(data)) item[key] = val;

        const params = {
            TableName: this.name,
            Item: marshall(item, {removeUndefinedValues:true})
        };

        await dynamoClient.putItem(params);
    }

    /**
     * Quickly queries a specific item by it's primary key.
     * NOTE: Assumes that there is no sort key!
     * 
     * @param keyValue The value of the Primary Key for the desired item
     * @returns The matching item, or `undefined`
     */
    async getByPrimaryKey(keyValue:any): Promise<T|undefined> {
        let key = {};
        key[this.primaryKey] = keyValue;

        const params = {
            TableName: this.name,
            Key: marshall(key)
        };

        let {Item} = await dynamoClient.getItem(params);
        if (!Item) return;
        return unmarshall(Item) as T;
    }

    /**
     * Deletes an item by it's keys. If the schema has a sort key, that value is required.
     * 
     * @param keyValue The value of the Primary Key for the desired item
     * @returns The matching item, or `undefined`
     */
         async deleteByKeys(primaryValue:any, sortValue?:any) {
            let key = {};
            key[this.primaryKey] = primaryValue;
            if (sortValue) {
                if (!this.sortKey) throw new Error ("Sort value provided, but table has no sort key!");
                else key[this.sortKey] = sortValue;
            }

            const params = {
                TableName: this.name,
                Key: marshall(key)
            };
    
            let res = await dynamoClient.deleteItem(params);
            // The only useful information I can deduce from the res
            // object is res.$metadata.httpStatusCode. That may give
            // some indication of success (I've only seen it be 200),
            // but the deleteItem method doesn't seem to give any other
            // indication.
            // TODO: handle errors appropriately.
        }

    /**
     * Intended to query tables with SortKeys where multiple rows correspond to
     * a single PrimaryKey value. Multiple comparisons can be performed on the
     * SortKey values for specificity.
     * 
     * Example: Querying all snitches for USERID (Primary Key) between dates A and B (Sort Key comparison).
     * 
     * @param primaryKeyValue Value of primary key
     * @param sortOperator If checking sort key, which coparison to use
     * @param sortKeyValue1 If checking sort key, first operand for comparison
     * @param sortKeyValue2 If checking sort key, second operand for BETWEEN operator.
     * @returns An array with all matching rows.
     */
    async query(primaryKeyValue:any, sortOperator?:SortOp, sortKeyValue1?:any, sortKeyValue2?:any): Promise<T[]> {
        let sortCondition = this.getSortCondition(sortOperator,sortKeyValue1,sortKeyValue2);
        let keyConditions = `${this.primaryKey} = ${PK_TOKEN} ${sortCondition ? (' and '+sortCondition) : ""}`;

        let expressionVals = {};
        expressionVals[PK_TOKEN] = primaryKeyValue;
        if (sortKeyValue1) expressionVals[S1_TOKEN] = sortKeyValue1;
        if (sortKeyValue2) expressionVals[S2_TOKEN] = sortKeyValue2;
        
        const params = {
            TableName: this.name,
            ExpressionAttributeValues: marshall(expressionVals),
            KeyConditionExpression: keyConditions,
        };

        let {Items} = await dynamoClient.query(params);
        if (!Items) return [];
        return Items.map(i=>unmarshall(i)) as T[];
    }

    /**
     * @param sortOperator Which comparison operator to use
     * @param sortKeyValue1 Comparison operand 1
     * @param sortKeyValue2 Comparison operand 2
     * @returns The formatted comparison expression or an empty string if no operator was provided.
     */
    private getSortCondition(sortOperator: SortOp | undefined, sortKeyValue1: any, sortKeyValue2: any): string {
        if (!sortOperator) return "";
        if (!this.sortKey) throw new Error("Query attempted to use sort condition but table has no sort key.");
        if (!sortKeyValue1) throw new Error(`No value provided for Sort Key '${this.sortKey}'`)

        if (sortOperator === SortOp.BEGINS_WITH) {
            return `begins_with (${this.sortKey}, ${S1_TOKEN})`;
        }
        
        if (sortOperator === SortOp.BETWEEN) {
            if (!sortKeyValue2) throw new Error("BETWEEN sort key operator requires two values, but only one was provided.")
            return `${this.sortKey} BETWEEN ${S1_TOKEN} AND ${S2_TOKEN}`;
        }

        return `${this.sortKey} ${sortOperator} ${S1_TOKEN}`;
    }
}

import { DynamoDB, QueryCommandInput, ScanCommandInput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export type TableSchema = {
    tableName:string,
    primaryKey:string,
    sortKey?:string,
    asIndex?:string
}

const dynamoClient = new DynamoDB({ 
    region: 'us-west-2' 
})

const PK_TOKEN = ":PK";
const S1_TOKEN = ":S1";
const S2_TOKEN = ":S2";

     
/**
 * Provides abstracted methods for making typical types of operations
 * on a DynamoDB Table where `T` represents the expected model for all rows
 */
export default class TableAccessObject<T> {
    public name:string;
    public primaryKey:string;
    public sortKey?:string;
    public index?:string

    /**
     * @param schema The schema for the table
     */
    constructor(schema:TableSchema) {    
        this.name = schema.tableName;
        this.primaryKey = schema.primaryKey;
        this.sortKey = schema.sortKey;
        this.index = schema.asIndex;
    }

    /**
     * Returns a TableAccessObject configured for an index of this table.
     * All method queries and operations will be performed on that index.
     * 
     * @param indexSchema Schema for the index
     * @returns
     */
    createIndexAccessObject(indexSchema:TableSchema):TableAccessObject<T> {
        if (indexSchema.tableName !== this.name) throw new Error("Index must be of the same table!");
        if (!indexSchema.asIndex) throw new Error("Index have an index name defined!");
        return new TableAccessObject<T>(indexSchema);
    }

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
            IndexName: this.index,
            Item: marshall(item, {removeUndefinedValues:true})
        };

        await dynamoClient.putItem(params);
    }

    /**
     * Quickly queries a specific item by it's primary key.
     * NOTE: Assumes that there is no sort key! If you want to query by sort key, use 'query'
     * 
     * @param keyValue The value of the Primary Key for the desired item
     * @returns The matching item, or `undefined`
     */
    async getByPrimaryKey(primaryValue:any): Promise<T|undefined> {
        let key = {};
        key[this.primaryKey] = primaryValue;

        const params = {
            TableName: this.name,
            IndexName: this.index,
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
                IndexName: this.index,
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

    // TODO Make query use the same comparison and pagination utilities as Scan
    /**
     * Intended to query tables with SortKeys where multiple rows correspond to
     * a single PrimaryKey value. Various comparisons can be performed on the
     * SortKey values for specificity.
     * 
     * Example: Querying all comments for MemoryId (Primary Key) between dates A and B (Sort Key comparison).
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
            IndexName: this.index,
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


    
    /**
     * A new version of the query method which allows more flexibility with coparisons and
     * handles pagination.
     * 
     * Intended to query tables with SortKeys where multiple rows correspond to
     * a single PrimaryKey value. Various comparisons can be performed on the
     * SortKey values for specificity.
     * 
     * Example: Querying all Snitches for UserId (Primary Key) between dates A and B (Sort Key comparison).
     * 
     * @param primaryKeyValue 
     * @param sortKeyCondition 
     * @param pagination 
     * @param filter 
     * @returns 
     */
     async pageQuery(primaryKeyValue:any, sortKeyCondition?:Condition, pagination?:PaginationOptions, filter?:Condition, extraParams?:{[key:string]:any}): Promise<PaginatedResponse<T>> {
        // Reusing the same counter ensures we don't repeat any aliases
        let counter = new Counter();
        let primaryKeyExpression = new Conditions.Equals(this.primaryKey,primaryKeyValue).buildExpression(counter);
        let sortKeyExpression = sortKeyCondition?.buildExpression(counter);
        let filterExpression = filter?.buildExpression(counter);

        let params:Partial<QueryCommandInput> = this.getBasicParams(extraParams);

        params.KeyConditionExpression = primaryKeyExpression.expression;

        if (sortKeyCondition) {
            params.KeyConditionExpression += " AND " + sortKeyExpression?.expression
        }

        if (filter) {
            params.FilterExpression = filterExpression?.expression
        }

        let allExpressionVals = {
            ...primaryKeyExpression.vals,
            ...sortKeyExpression?.vals,
            ...filterExpression?.vals
        };

        params.ExpressionAttributeValues = marshall(allExpressionVals);

        if (pagination) {
            params.ExclusiveStartKey = pagination.pageBreakKey ? JSON.parse(pagination.pageBreakKey) : undefined;
            params.Limit = pagination.pageSize;
        }

        let {Items,LastEvaluatedKey} = await dynamoClient.query(params as QueryCommandInput);
        if (!Items) Items = [];
        let records = Items.map(i=>unmarshall(i) as T);

        return {
            records,
            pageBreakKey: LastEvaluatedKey? JSON.stringify(LastEvaluatedKey) : undefined,
            pageSize: pagination?.pageSize
        }
    }








    /**
     * Reads all items in table, filtering for thosee that match the provided conditions.
     * 
     * THIS IS THE MOST EXPENSIVE TYPE OF OPERATION! Use sparingly and wisely.
     * 
     * @param filter Defines a filter for the values to be returned. If not provided,
     * all records will be returned.
     * @param pagination Defines pagination options. If not provided, all matching items
     * will be returned until the read limit (1MB)
     * @returns 
     */
    async scan(filter?:Condition, pagination?:PaginationOptions, extraParams?:{[key:string]:any}): Promise<PaginatedResponse<T>> {
        let params:Partial<ScanCommandInput> = this.getBasicParams(extraParams);
        if (filter) {
            let conditionVals = filter.buildExpression(new Counter());
            params.FilterExpression = conditionVals.expression;
            params.ExpressionAttributeValues = marshall(conditionVals.vals);
        }

        if (pagination) {
            params.ExclusiveStartKey = pagination.pageBreakKey ? JSON.parse(pagination.pageBreakKey) : undefined;
            params.Limit = pagination.pageSize;
        }

        let {Items,LastEvaluatedKey} = await dynamoClient.scan(params as ScanCommandInput);
        if (!Items) Items = [];
        let records = Items.map(i=>unmarshall(i) as T);

        return {
            records,
            pageBreakKey: LastEvaluatedKey? JSON.stringify(LastEvaluatedKey) : undefined,
            pageSize: pagination?.pageSize
        }

    }

    private getBasicParams(extraParams?:any) {
        return {
            TableName: this.name,
            IndexName: this.index,
            ...extraParams
        }
    }
}

abstract class Condition {
    abstract buildExpression(counter:Counter): {expression:string, vals:{[alias:string]:any}};
    protected abstract getConditionString(aliases:string[]): string;
}

abstract class ComparisonCondition extends Condition {
    protected vals: any[];
    constructor(protected attributeName:string, protected operator:SortOp, ...vals:any[]) {
        super();
        this.vals = vals;
    }

    protected abstract getConditionString(aliases:string[]): string;

    buildExpression(counter:Counter): {expression:string, vals:{[alias:string]:any}} {
        let expression = "";
        let vals = {};
        let aliases:string[] = [];
        if (this.vals.length === 0) throw new Error(`No values provided for Condition '${this.operator}'`)

        this.vals.forEach(v=>{
            let alias = this.getValueAlias(counter)
            aliases.push(alias)
            vals[alias] = v;
        })
        
        expression = this.getConditionString(aliases)

        return {expression, vals};
    }

    protected getValueAlias(counter:Counter) {
        return `:${this.attributeName}_${counter.inc()}`
    }
}
class BinaryOpComparisonCondition extends ComparisonCondition {
    constructor(attributeName:string, operator:SortOp,val:any) {
        super(attributeName, operator, val);
    }

    protected getConditionString(aliases: string[]): string {
        if (this.vals.length < 1) throw new Error(`Not enough conditions provided for Condition '${this.operator}'`)
        return `${this.attributeName} ${this.operator} ${aliases[0]}`
    }
}


abstract class LogicalCondition extends Condition {
    public conditions: Condition[];
    constructor(public operator:LogicalOperator, ...conditions:Condition[]) {
        super()
        this.conditions = conditions;
    }

    protected abstract getConditionString(aliases:string[]): string;

    buildExpression(counter:Counter): {expression:string, vals:{[alias:string]:any}} {
        let expression = "";
        let vals = {}

        if (this.conditions.length === 0) throw new Error(`No conditions provided for Condition '${this.operator}'`)

        let conditionStrings = this.conditions.map(c=>{
            let cVals = c.buildExpression(counter);
            Object.keys(cVals.vals).forEach(alias=>vals[alias] = cVals.vals[alias]);
            return cVals.expression;
        })

        expression = this.getConditionString(conditionStrings)

        return {expression, vals};
    }
}

class TwoOpLogicalCondition extends LogicalCondition {
    constructor(operator:LogicalOperator,condition1:Condition,condition2:Condition) {
        super(operator, condition1, condition2);
    }

    protected getConditionString(conditionStrings: string[]): string {
        if (this.conditions.length < 2) throw new Error(`Not enough conditions provided for Condition '${this.operator}'`)
        return `(${conditionStrings[0]}) ${this.operator} (${conditionStrings[1]})`    }
}

export type LogicalChainLink = Condition|LogicalOperator|string;

export class LogicalConditionChain extends Condition {
    constructor(private chain:LogicalChainLink[]) {
        super()
    }

    buildExpression(counter: Counter): { expression: string; vals: { [alias: string]: any; }; } {
        let expression = "";
        let vals = {}

        this.chain.forEach(c=>{
            if (c instanceof Condition) {
                let cVals = c.buildExpression(counter);
                Object.keys(cVals.vals).forEach(alias=>vals[alias] = cVals.vals[alias]);
                expression += `(${cVals.expression}) `;
            }
            else {
                expression += c+" ";
            }
           
        })

        return {expression, vals};
    }
    protected getConditionString(conditionStrings: string[]): string {
        return "";
    }

}


export const Conditions = {
    Equals: class EqualsComparison extends BinaryOpComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.EQUALS, val);
        }
    },

    NotEquals: class NotEqualsComparison extends BinaryOpComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.NOT_EQUALS, val);
        }
    },

    LessThan: class LessThanComparison extends BinaryOpComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.LESS_THAN, val);
        }
    },

    LessOrEqual: class LessOrEqualComparison extends BinaryOpComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.LESS_THAN_OR_EQUAL, val);
        }
    },
    MoreThan: class MoreThanComparison extends BinaryOpComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.MORE_THAN, val);
        }
    },

    MoreOrEqual: class MoreOrEqualComparison extends BinaryOpComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.MORE_THAN_OR_EQUAL, val);
        }
    },

    BeginsWith: class BeginsWithComparison extends ComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.BEGINS_WITH, val);
        }

        protected getConditionString(aliases: string[]): string {
            if (this.vals.length < 1) throw new Error(`Not enough values provided for Condition '${this.operator}'`)
            return `begins_with (${this.attributeName}, ${aliases[0]})`;
        }
    },

    Contains: class ContainsComparison extends ComparisonCondition {
        constructor(attributeName:string, val:any) {
            super(attributeName, SortOp.CONTAINS, val);
        }

        protected getConditionString(aliases: string[]): string {
            if (this.vals.length < 1) throw new Error(`Not enough values provided for Condition '${this.operator}'`)
            return `contains (${this.attributeName}, ${aliases[0]})`;
        }
    },

    Between: class BetweenComparison extends ComparisonCondition {
        constructor(attributeName:string, val1:any, val2:any) {
            super(attributeName, SortOp.BETWEEN, val1, val2);
        }

        protected getConditionString(aliases: string[]): string {
            if (this.vals.length < 2) throw new Error(`Not enough values provided for Condition '${this.operator}'`)
            return `${this.attributeName} BETWEEN ${aliases[0]} AND ${aliases[1]}`;
        }
    },

    In: class InComparison extends ComparisonCondition {
        constructor(attributeName:string, ...val:any[]) {
            super(attributeName, SortOp.IN, val);
        }

        protected getConditionString(aliases: string[]): string {
            let list = "";
            aliases.forEach((a,i)=>{
                list += a;
                if (i < aliases.length-1) list += ", ";
            })
            return `${this.attributeName} IN (${list})`;
        }
    },

    // Logical Conditions
    And: class AndCondition extends TwoOpLogicalCondition {
        constructor(condition1:Condition,condition2:Condition) {
            super(LogicalOperator.AND, condition1, condition2);
        }
    },

    Or: class OrCondition extends TwoOpLogicalCondition {
        constructor(condition1:Condition,condition2:Condition) {
            super(LogicalOperator.OR, condition1, condition2);
        }
    },

    Not: class NotCondition extends LogicalCondition {
        constructor(condition:Condition) {
            super(LogicalOperator.NOT, condition);
        }

        protected getConditionString(conditionStrings: string[]): string {
            if (this.conditions.length !== 1) throw new Error(`The NOT Condition must have exactly one condition argument`);
            return `${this.operator} (${conditionStrings[0]})`
        }
    }

}

export class Counter {
    constructor(public cnt = 0){};
    inc = ()=> ++this.cnt
}

/**
 * Valid comparison operators for querying SortKeys
 */
 export enum SortOp {
    EQUALS = "=",
    NOT_EQUALS = "<>",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    MORE_THAN = ">",
    MORE_THAN_OR_EQUAL = ">=",
    IN = "IN",
    BETWEEN = "BETWEEN",
    BEGINS_WITH = "begins_with",
    CONTAINS = "contains"
}

/**
 * Valid logical operators for compound comparisons
 */
 export enum LogicalOperator {
    AND = "AND", 
    OR = "OR", 
    NOT = "NOT", 
}


export type PaginationOptions = {
    /**
     * A JSON string version of the composite key for the
     * last item on the previous page
     */
    pageBreakKey?: string,
    pageSize?: number
}
export type PaginatedResponse<T> = {
    records: T[],
    /**
     * A JSON string version of the composite key for the
     * last item on this page
     */
    pageBreakKey?: string,
    pageSize?: number
}
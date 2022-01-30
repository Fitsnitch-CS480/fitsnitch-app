import { Conditions, Counter, LogicalConditionChain, LogicalOperator } from "./TableAccessObject";

describe("Comparisons", ()=>{

    let singlecomparisonCases = [
        {condition: Conditions.Equals,attr:"attr",val:5},
        {condition: Conditions.NotEquals,attr:"attr",val:5},
        {condition: Conditions.BeginsWith,attr:"attr",val:"5"},
        {condition: Conditions.Contains,attr:"attr",val:"5"},
        {condition: Conditions.LessThan,attr:"num",val:2},
        {condition: Conditions.LessOrEqual,attr:"max",val:5},
        {condition: Conditions.MoreThan,attr:"max",val:5},
        {condition: Conditions.MoreOrEqual,attr:"num",val:2},
    ]

    singlecomparisonCases.forEach(c=>{
        describe(c.condition, ()=>{
            it ("should construct string and aliases",()=>{
                let condition = new c.condition(c.attr,c.val)
                let cVals = condition.toStringAndVals(new Counter());
                console.log(cVals.compString,"\n",cVals.vals)
            })
        })
    })


    describe(Conditions.Between, ()=>{
        it ("should construct string and aliases",()=>{
            let condition = new Conditions.Between("price",5,25)
            let cVals = condition.toStringAndVals(new Counter());
            console.log(cVals.compString,"\n",cVals.vals)
        })
    })

})


describe("Logical Conditions", ()=>{

    let binaryOperators = [
        {condition: Conditions.And,cond1:new Conditions.NotEquals("price",20),cond2:new Conditions.Between("price",10,25)},
        {condition: Conditions.Or,cond1:new Conditions.Equals("price",20),cond2:new Conditions.Between("price",30,25)},
    ]

    binaryOperators.forEach(c=>{
        describe(c.condition, ()=>{
            it ("should construct string and aliases",()=>{
                let condition = new c.condition(c.cond1,c.cond2)
                let cVals = condition.toStringAndVals(new Counter());
                console.log(cVals.compString,"\n",cVals.vals)
            })
        })
    })

})

describe(LogicalConditionChain, ()=>{
    it("should create proper filter expressions", ()=>{
        let chain = [
            "(", new Conditions.BeginsWith("attr","L"), LogicalOperator.AND,
            new Conditions.Contains("attr","o"), ")", LogicalOperator.OR, LogicalOperator.NOT,
            new Conditions.Equals("attr","Look")
        ];
        let condition = new LogicalConditionChain(chain);
        let cVals = condition.toStringAndVals(new Counter());
        console.log(cVals.compString,"\n",cVals.vals)
    })

    
    it.only("should create proper filter expressions", ()=>{
        let chain = [
            new Conditions.Contains("firstname","Lila"), LogicalOperator.OR,
            new Conditions.Contains("lastname","Lila"), LogicalOperator.OR,
            new Conditions.Contains("firstname","Evan"), LogicalOperator.OR,
            new Conditions.Contains("lastname","Evan")
        ];
        let condition = new LogicalConditionChain(chain);
        let cVals = condition.toStringAndVals(new Counter());
        console.log(cVals.compString,"\n",cVals.vals)
    })
})
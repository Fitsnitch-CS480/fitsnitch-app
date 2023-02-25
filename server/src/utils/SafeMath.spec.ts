import { SafeMath } from "./SafeMath";

describe(SafeMath, ()=>{
    
    describe(SafeMath.add, ()=>{
        describe("should handle valid inputs correctly",()=>{
            let validCases = [
                {a: 1, b: 1, result: 2},
                {a: 0.1, b: 0.2, result: 0.3},
                {a: 40.2500, b: 0.0002, result: 40.2502},
                {a: 40.1, b: 0.02, result: 40.12},
                {a: 40.001, b: 0.2, result: 40.201}
            ]
            
            for (let c of validCases) {
                it("Case: "+JSON.stringify(c), async ()=>{
                    expect(SafeMath.add(c.a, c.b)).toBe(c.result);
                })
            }
        })
    })
})
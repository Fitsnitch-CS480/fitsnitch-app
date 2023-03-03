import PriorityQueue from "./PriorityQueue";

describe(PriorityQueue, ()=>{

    class MinQueue extends PriorityQueue<number> {
        protected isHigherPriority(a: number, b: number): boolean {
            return a<b;
        }

    }

    let heap = new MinQueue();

    beforeEach(()=>{
        heap = new MinQueue()
    })

    
    describe(heap.insert, ()=>{
        it("should add the first item to position 0", ()=>{
            heap.insert(5);
            expect(heap.toArray()).toMatchObject([5]);
        })

        it("should place a greater item in position 1", ()=>{
            heap.insert(5);
            heap.insert(9);
            expect(heap.toArray()).toMatchObject([5,9]);
        })

        it("should place a lesser item at beginning", ()=>{
            heap.insert(5);
            heap.insert(9);
            heap.insert(1);
            expect(heap.toArray()).toMatchObject([1,9,5]);
        })

        it("should place a middle item in middle", ()=>{
            heap.insert(5);
            heap.insert(9);
            heap.insert(1);
            heap.insert(4);
            expect(heap.toArray()).toMatchObject([1,4,5,9]);
        })

        it("should bubble idx 5 to idx 2", ()=>{
            heap.insert(5);
            heap.insert(9);
            heap.insert(1);
            heap.insert(4);
            heap.insert(2);
            expect(heap.toArray()).toMatchObject([1,2,5,9,4]);
        })
    })


    describe(heap.peekMin, ()=>{
        it("should return smallest and do nothing", ()=>{
            heap.insert(5);
            heap.insert(9);
            heap.insert(1);
            heap.insert(4);
            expect(heap.peekMin()).toBe(1)
            expect(heap.toArray()).toMatchObject([1,4,5,9]);
        })
    })

    describe(heap.popMin, ()=>{
        it("should pop and return the current smallest", ()=>{
            heap.insert(5);
            heap.insert(9);
            heap.insert(1);
            heap.insert(4);
            expect(heap.popMin()).toBe(1);
            expect(heap.toArray().length).toBe(3);
        })

        it("should rearrange correctly", ()=>{
            heap.insert(5);
            heap.insert(9);
            heap.insert(1);
            heap.insert(4);
            heap.popMin();
            expect(heap.toArray()).toMatchObject([4,9,5]);
        })
    })




    it("should perform test sequence", ()=>{
        const heap = new MinQueue();
        heap.insert(3);
        heap.insert(4);
        heap.insert(9);
        heap.insert(5);
        heap.insert(2);
        expect(heap.toArray()).toMatchObject([2,3,9,5,4]);

        heap.popMin();
        expect(heap.toArray()).toMatchObject([3,4,9,5]);

        heap.insert(7);
        expect(heap.toArray()).toMatchObject([3,4,9,5,7]);

        heap.popMin()
        heap.popMin()
        heap.popMin()
        heap.popMin()
        heap.popMin()
        expect(heap.toArray()).toMatchObject([]);

    })

    it("should handle abstraction", ()=>{
        class Dog {
            constructor(public name:string, public age:number) {}
        }

        class WeirdQueue extends PriorityQueue<Dog> {
            protected isHigherPriority(a: Dog, b: Dog): boolean {
                if (a.name === "Mr. Tums") return true;
                if (a.age < b.age) return false;
                if (b.name[0].toLowerCase() === 'h') return false;
                return true;
            }
        }

        let dogPile = new WeirdQueue();

        let ernie7 = new Dog("Ernie",7);
        let humph9 = new Dog("Humph",9);
        let tums10 = new Dog("Mr. Tums",2);

        dogPile.insert(ernie7);
        dogPile.insert(humph9);
        expect(dogPile.toArray()).toMatchObject([humph9,ernie7]);
        dogPile.insert(tums10);
        expect(dogPile.toArray()).toMatchObject([tums10,ernie7,humph9]);
    })
})

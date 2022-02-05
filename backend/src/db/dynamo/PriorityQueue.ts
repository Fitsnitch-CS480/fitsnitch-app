export default abstract class PriorityQueue<T> {
    heap:any[] = [];

    public toArray() {
        return this.heap
    }

    public peekMin (): T {
        /* Accessing the min element at index 1 in the heap array */
        return this.heap[0]
    }

    public insert (node:T) {
        this.heap.push(node)
        this.bubbleUp(this.heap.length - 1);
    }

    protected abstract isHigherPriority(a:T, b:T): boolean;

    private bubbleUp(idx:number) {
        if (idx === 0) return;
        let parentIdx = this.parentIdx(idx)
        if (this.isHigherPriority(this.heap[idx], this.heap[parentIdx])) {
            // swap places
            let temp = this.heap[idx];
            this.heap[idx] = this.heap[parentIdx];
            this.heap[parentIdx] = temp;
            this.bubbleUp(parentIdx)
        }
    }

    private parentIdx(idx:number) {
        return Math.floor((idx-1)/2)
    }


    private leftChildIdx(idx:number) {
        return (idx*2)+1
    }
    private rightChildIdx(idx:number) {
        return (idx*2)+2
    }

    private siftDown(idx:number) {
        let idxToSwap;
        let leftIdx = this.leftChildIdx(idx)
        if (this.heap[leftIdx] && this.isHigherPriority(this.heap[leftIdx], this.heap[idx])) {
            idxToSwap = leftIdx;
        }
        if (!idxToSwap) {
            let rightIdx = this.rightChildIdx(idx)
            if (this.heap[rightIdx] && this.isHigherPriority(this.heap[rightIdx], this.heap[idx])) {
                idxToSwap = rightIdx;
            }   
        }
        if (!idxToSwap) return;

        // swap places
        let temp = this.heap[idx];
        this.heap[idx] = this.heap[idxToSwap];
        this.heap[idxToSwap] = temp;
        this.siftDown(idxToSwap)
    }


    
    public popMin(): T|null {
        if (this.heap.length === 0) {
            return null
        }

        /* Smallest element is at the index 1 in the heap array */
        let smallest = this.heap[0]

        /* When there are more than one elements in the array, we put the right most element at the first position
            and start comparing nodes with the child nodes
        */
        if (this.heap.length === 1) {
            this.heap = [];
        }
        else {
            this.heap[0] = this.heap[this.heap.length-1]
            this.heap.splice(this.heap.length - 1,1)

            this.siftDown(0);
        }

        return smallest
    }
}
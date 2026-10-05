// ==============================================================================
// Domain Min-Priority Queue for Dijkstra Search
// ==============================================================================

export interface QueueItem<T> {
  priority: number;
  data: T;
  tieBreakerKey?: string;
}

export class MinPriorityQueue<T> {
  private heap: QueueItem<T>[] = [];
  private comparator: (a: QueueItem<T>, b: QueueItem<T>) => number;

  constructor(customComparator?: (a: QueueItem<T>, b: QueueItem<T>) => number) {
    this.comparator = customComparator || ((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      if (a.tieBreakerKey && b.tieBreakerKey) {
        return a.tieBreakerKey.localeCompare(b.tieBreakerKey);
      }
      return 0;
    });
  }

  public enqueue(priority: number, data: T, tieBreakerKey?: string): void {
    const item: QueueItem<T> = { priority, data, tieBreakerKey };
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  public dequeue(): QueueItem<T> | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0 && bottom) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parentIdx]) < 0) {
        [this.heap[index], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[index]];
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < length && this.comparator(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < length && this.comparator(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

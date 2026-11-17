import { Player } from "./types";

/**
 * Dynamic Matchmaking Priority Score Formula based on Synopsis Section 5.B:
 * P(player, t) = (wait_seconds * w_wait) + StarvationBoost(wait) + SkillFactor + PingFactor
 * 
 * Starvation Prevention:
 * If waiting time exceeds threshold (45 seconds), an exponential acceleration boost is applied.
 * This guarantees any waiting player rapidly percolates to the root of the Max-Heap, avoiding starvation.
 */
export function computePlayerPriority(player: Player, targetRating = 1500): number {
  // 1. Base wait contribution (2.5 points per second)
  let waitScore = player.wait * 2.5;

  // 2. Anti-Starvation exponential surge
  if (player.wait > 45) {
    const excess = player.wait - 45;
    waitScore += excess * excess * 0.15 + excess * 5.0;
  }

  // 3. Skill central accessibility (players within standard matchmaking deviation have higher match readiness)
  const ratingSpread = Math.abs(player.rating - targetRating);
  const skillBonus = Math.max(0, 100 - ratingSpread / 12);

  // 4. Latency accessibility
  const pingBonus = Math.max(0, 100 - player.ping * 0.8);

  // 5. Winrate normalization
  const winRateBonus = player.winRate * 0.3;

  const composite = waitScore + skillBonus * 0.25 + pingBonus * 0.2 + winRateBonus;
  return Math.round(composite * 10) / 10;
}

export interface HeapTraceEntry {
  type: "sift_up" | "sift_down" | "insert" | "extract";
  index: number;
  parentOrChildIndex?: number;
  message: string;
}

/**
 * Pure Binary Max-Heap Data Structure
 * Formal Time Complexities:
 * - Insert: O(log N)
 * - ExtractMax: O(log N)
 * - Peek: O(1)
 * - Bottom-Up Heapify: O(N)
 * - Space Complexity: O(N) in contiguous sequential buffer
 */
export class PlayerMaxHeap {
  private heap: Player[] = [];
  public operationTrace: HeapTraceEntry[] = [];

  constructor(initialPlayers?: Player[]) {
    if (initialPlayers && initialPlayers.length > 0) {
      this.heap = initialPlayers.map((p) => ({
        ...p,
        priorityScore: computePlayerPriority(p),
      }));
      this.buildHeap();
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): Player | undefined {
    return this.heap[0];
  }

  public toArray(): Player[] {
    return [...this.heap];
  }

  public insert(player: Player): void {
    const scored: Player = {
      ...player,
      priorityScore: computePlayerPriority(player),
    };
    this.heap.push(scored);
    this.siftUp(this.heap.length - 1);
  }

  public extractMax(): Player | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) {
      const single = this.heap.pop()!;
      this.operationTrace.push({
        type: "extract",
        index: 0,
        message: `Extracted sole root element: ${single.name} (${single.priorityScore})`,
      });
      return single;
    }

    const max = this.heap[0];
    const last = this.heap.pop()!;
    this.heap[0] = last;

    this.operationTrace.push({
      type: "extract",
      index: 0,
      message: `Extracted Max root ${max.name} (Priority ${max.priorityScore}). Moved last element ${last.name} to root.`,
    });

    this.siftDown(0);
    return max;
  }

  /**
   * Starvation Prevention Controller:
   * Increments waiting times and dynamically recalculates priorities.
   * Then executes Bottom-Up Heapify O(N) to restore Max-Heap property.
   */
  public ageQueue(secondsIncrement = 5): void {
    for (let i = 0; i < this.heap.length; i++) {
      this.heap[i].wait += secondsIncrement;
      this.heap[i].priorityScore = computePlayerPriority(this.heap[i]);
    }
    this.buildHeap();
  }

  /**
   * Linear-Time Bottom-Up Heapify Algorithm: O(N)
   * Starts at parent of last leaf floor((N-2)/2) and sifts down to index 0.
   */
  private buildHeap(): void {
    const n = this.heap.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.siftDown(i);
    }
  }

  private siftUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      const currentScore = this.heap[current].priorityScore ?? 0;
      const parentScore = this.heap[parent].priorityScore ?? 0;

      if (currentScore > parentScore) {
        this.operationTrace.push({
          type: "sift_up",
          index: current,
          parentOrChildIndex: parent,
          message: `Sift-Up Swap: Child [${current}] (${this.heap[current].name}: ${currentScore}) > Parent [${parent}] (${this.heap[parent].name}: ${parentScore})`,
        });

        [this.heap[current], this.heap[parent]] = [this.heap[parent], this.heap[current]];
        current = parent;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    let current = index;
    const n = this.heap.length;

    while (true) {
      let largest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      const currentScore = this.heap[largest]?.priorityScore ?? 0;

      if (left < n && (this.heap[left].priorityScore ?? 0) > currentScore) {
        largest = left;
      }

      const largestScore = this.heap[largest]?.priorityScore ?? 0;
      if (right < n && (this.heap[right].priorityScore ?? 0) > largestScore) {
        largest = right;
      }

      if (largest !== current) {
        this.operationTrace.push({
          type: "sift_down",
          index: current,
          parentOrChildIndex: largest,
          message: `Sift-Down Swap: Parent [${current}] (${this.heap[current].name}) < Child [${largest}] (${this.heap[largest].name}: ${this.heap[largest].priorityScore})`,
        });

        [this.heap[current], this.heap[largest]] = [this.heap[largest], this.heap[current]];
        current = largest;
      } else {
        break;
      }
    }
  }

  /**
   * Generates hierarchical node data for rendering the Binary Tree visually.
   */
  public getVisualTreeNodes(): Array<{
    node: Player;
    index: number;
    level: number;
    parentIndex?: number;
    leftChildIndex?: number;
    rightChildIndex?: number;
  }> {
    return this.heap.slice(0, 15).map((player, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const parentIndex = index > 0 ? Math.floor((index - 1) / 2) : undefined;
      const leftChildIndex = 2 * index + 1 < this.heap.length ? 2 * index + 1 : undefined;
      const rightChildIndex = 2 * index + 2 < this.heap.length ? 2 * index + 2 : undefined;

      return {
        node: player,
        index,
        level,
        parentIndex,
        leftChildIndex,
        rightChildIndex,
      };
    });
  }
}

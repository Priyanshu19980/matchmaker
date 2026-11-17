import { Player, SortingBenchmarkResult } from "./types";

export type SortKey = "rating" | "wait" | "ping" | "priorityScore";
export type SortOrder = "asc" | "desc";

function getVal(p: Player, key: SortKey): number {
  if (key === "rating") return p.rating;
  if (key === "wait") return p.wait;
  if (key === "ping") return p.ping;
  return p.priorityScore ?? 0;
}

function compare(a: Player, b: Player, key: SortKey, order: SortOrder): number {
  const vA = getVal(a, key);
  const vB = getVal(b, key);
  return order === "desc" ? vB - vA : vA - vB;
}

/**
 * 1. QuickSort Implementation (Divide and Conquer)
 * Average: O(N log N) | Worst: O(N²) | Space: O(log N)
 */
export function runQuickSort(
  players: Player[],
  key: SortKey = "rating",
  order: SortOrder = "desc"
): { sorted: Player[]; stats: SortingBenchmarkResult } {
  const t0 = performance.now();
  const arr = [...players];
  let comparisons = 0;
  let swaps = 0;

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      if (compare(arr[j], pivot, key, order) <= 0) {
        i++;
        swaps++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    swaps++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  quickSortHelper(0, arr.length - 1);
  const t1 = performance.now();

  return {
    sorted: arr,
    stats: {
      algorithmName: "QuickSort",
      timeMs: Math.round((t1 - t0) * 1000) / 1000,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      timeComplexity: "O(N log N) avg / O(N²) worst",
      spaceComplexity: "O(log N)",
    },
  };
}

/**
 * 2. MergeSort Implementation (Divide and Conquer, Stable)
 * Worst: O(N log N) | Best: O(N log N) | Space: O(N)
 */
export function runMergeSort(
  players: Player[],
  key: SortKey = "rating",
  order: SortOrder = "desc"
): { sorted: Player[]; stats: SortingBenchmarkResult } {
  const t0 = performance.now();
  let comparisons = 0;
  let swaps = 0;

  function mergeSortHelper(items: Player[]): Player[] {
    if (items.length <= 1) return items;
    const mid = Math.floor(items.length / 2);
    const left = mergeSortHelper(items.slice(0, mid));
    const right = mergeSortHelper(items.slice(mid));
    return merge(left, right);
  }

  function merge(left: Player[], right: Player[]): Player[] {
    const res: Player[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      comparisons++;
      if (compare(left[i], right[j], key, order) <= 0) {
        res.push(left[i]);
        i++;
      } else {
        res.push(right[j]);
        j++;
      }
      swaps++;
    }
    while (i < left.length) res.push(left[i++]);
    while (j < right.length) res.push(right[j++]);
    return res;
  }

  const sorted = mergeSortHelper(players);
  const t1 = performance.now();

  return {
    sorted,
    stats: {
      algorithmName: "MergeSort",
      timeMs: Math.round((t1 - t0) * 1000) / 1000,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      timeComplexity: "O(N log N) guaranteed",
      spaceComplexity: "O(N) aux memory",
    },
  };
}

/**
 * 3. HeapSort Implementation (In-place binary max-heap)
 * Worst: O(N log N) | In-Place: O(1) auxiliary space
 */
export function runHeapSort(
  players: Player[],
  key: SortKey = "rating",
  order: SortOrder = "desc"
): { sorted: Player[]; stats: SortingBenchmarkResult } {
  const t0 = performance.now();
  const arr = [...players];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  // We want final output in requested 'order'.
  // Standard heapsort builds heap and extracts to end.
  const heapCmp = (a: Player, b: Player) => {
    // Inverse order for building max/min heap
    return order === "desc" ? compare(a, b, key, "asc") : compare(a, b, key, "desc");
  };

  function heapify(size: number, rootIdx: number) {
    let extremum = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < size) {
      comparisons++;
      if (heapCmp(arr[left], arr[extremum]) > 0) extremum = left;
    }
    if (right < size) {
      comparisons++;
      if (heapCmp(arr[right], arr[extremum]) > 0) extremum = right;
    }

    if (extremum !== rootIdx) {
      swaps++;
      [arr[rootIdx], arr[extremum]] = [arr[extremum], arr[rootIdx]];
      heapify(size, extremum);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract one by one
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }

  const t1 = performance.now();

  return {
    sorted: arr,
    stats: {
      algorithmName: "HeapSort",
      timeMs: Math.round((t1 - t0) * 1000) / 1000,
      comparisonsCount: comparisons,
      swapsCount: swaps,
      timeComplexity: "O(N log N) guaranteed",
      spaceComplexity: "O(1) in-place",
    },
  };
}

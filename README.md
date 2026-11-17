# Multiplayer Game Matchmaking and Team Balancing System

**Course:** Analysis and Design of Algorithms (ADA)  
**Institution:** Faculty of Technology, University of Delhi, New Delhi - 110007  
**Department:** Computer Science and Engineering (CSE-B2, 3rd Semester)  
**Submitted to:** Dr. Juhi Jain  
**Submitted by:**
- Thulasi Venkata Harsha Vardhan (25293916109)
- Priyanshu Kumar (25293916077)

---

## 🏛️ System Architecture

This project is a sophisticated, full-featured **Analysis and Design of Algorithms (ADA)** matchmaking and team balancing platform. Rather than toy simulations, it implements real mathematical data structures, graph clustering, dynamic priority queue scheduling, and greedy partitioning algorithms:

```
                                  [ Player Pool / Datasets ]
                                              │
                                              ▼
                             [ Section 5.B: Binary Max-Heap ]
                             • Priority Queue: O(log N) insert/extract
                             • Dynamic Anti-Starvation Aging Ticker
                                              │ (Anchor Extraction)
                                              ▼
                             [ Section 5.C: Compatibility Network ]
                             • Graph G = (V, E): Adjacency Matrix & List
                             • W(u, v) = f(Region, Skill, Ping, Role)
                             • Densest Subgraph Cluster Extraction
                                              │ (2K Lobby)
                                              ▼
                             [ Section 5.A: Greedy Team Balancer ]
                             • LPT Variant Partition: O(K log K)
                             • Dynamic running sum balance
                             • Verified against Global Optimum (7/6 ratio)
                                              │
                                              ▼
                             [ Section 4: Edge Server Allocation ]
                             • Dijkstra Min-Latency Path Routing
                             • Match Quality Score (MQS) Gauge
```

---

## ⚡ Core Algorithmic Paradigms & Laboratories

1. **Live Match Engine & Queue (`hub`):**
   - Active queue state with real player data
   - Single match execution & Session history logging
   - Team Alpha vs Team Omega rosters with role distributions
   - Multi-Pillar Match Quality Score (MQS)

2. **Batch Multi-Match Platform (`batch`):**
   - Real multi-lobby generator: Takes the entire player queue (e.g. 32 to 100+ players) and drains the Priority Queue to form multiple concurrent matches simultaneously!
   - Aggregate statistics across all concurrent lobbies (Mean Delta, Quality, Server Load).

3. **Greedy Balancer Lab (`greedy` - Section 5.A):**
   - Interactive Greedy workbench with custom MMR inputs.
   - Step-by-step decision playback with running totals and reasoning.
   - **Graham's 7/6 Theorem Verification:** Compares greedy output directly against the Global Exhaustive Optimum ($C(2K, K)$) to empirically demonstrate approximation guarantees!

4. **Priority Queue & Heap Lab (`priority` - Section 5.B):**
   - Real Binary Max-Heap Tree visualization with real node indices and parent/child pointers.
   - Contiguous Heap Array buffer visualizer.
   - Dynamic Anti-Starvation aging ticker (+15s Wait button and Starving Player injector).

5. **Graph Compatibility Lab (`graph` - Section 5.C):**
   - Adjacency Matrix ($V \times V$) interactive heatmap table.
   - SVG Network Canvas with regional cluster separation (India, Asia, EU, NA).
   - Dynamic edge compatibility threshold filter.

6. **Sorting Algorithms Benchmark (`sorting` - Section 5.D):**
   - Live shootout: **QuickSort** vs **MergeSort** vs **HeapSort**.
   - Sorts real player arrays by Skill Rating, Wait Time, Ping, or Priority.
   - Measures execution times, comparison counts, and swap operations.

7. **Strategy Comparison (`compare` - Section 8):**
   - Side-by-side empirical evaluation: Proposed Architecture vs Naive Random vs Skill-Only Greedy.
   - Quantifies skill disparity reductions and quality score gains.

8. **Player Pool & Datasets Manager (`players` - Section 6):**
   - Full 9-attribute schema CRUD.
   - Pre-loaded datasets: DU Faculty of Technology Collegiate Pool (32 players), Global Ranked Ladder (48 players), Starvation Stress Pool.
   - CSV and JSON Export / Import.

9. **Academic Documentation (`docs`):**
   - Full Project Synopsis documentation for DU Faculty of Technology and Dr. Juhi Jain.
   - Formal mathematical proofs, Time and Space Complexity Master Table, pseudocode, and viva questions.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run production build
npm run build
```

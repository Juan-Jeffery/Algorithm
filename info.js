export function updateInfo(alg) {
  const infoMap = {
    BFS: {
      name: "Breadth-First Search",
      time: "O(V + E)",
      space: "O(V)",
      intro: "Traverse graph level by level using a queue. (使用佇列逐層展開的搜尋方法，適合處理廣度層次相關的問題)",
      method: "從起點開始，將節點放入佇列，然後不斷取出佇列中的節點，訪問其鄰居並依序加入佇列，直到所有可達節點都被訪問。此方法會先探索與起點距離最近的節點，逐步擴展到更遠的節點。",
      suitable: "Shortest path in unweighted graphs."
    },
    DFS: {
      name: "Depth-First Search",
      time: "O(V + E)",
      space: "O(V)",
      intro: "Explore as deep as possible before backtracking. (使用遞迴或堆疊深入展開，直到無路可走才回溯)",
      method: "從起點開始，沿著一條路徑不斷深入，直到無法繼續，然後回溯至前一個分叉點，再嘗試另一條路徑，直到所有節點都被遍歷。常透過遞迴實現，也可以使用明確的堆疊。",
      suitable: "Cycle detection, topological sort."
    },
    Dijkstra: {
      name: "Dijkstra's Algorithm",
      time: "O((V + E) log V)",
      space: "O(V)",
      intro: "Find shortest paths in weighted graphs without negative edges. (適合邊權重非負的情況)",
      method: "初始化起點距離為0，其他為∞，使用優先佇列反覆取出當前距離最小的節點，更新其鄰居的距離值。如果透過當前節點可以得到更小的距離，就更新並放回優先佇列。直到所有節點的最短距離確定。",
      suitable: "GPS, routing protocols."
    },
    Bubble: {
      name: "Bubble Sort",
      time: "O(n²)",
      space: "O(1)",
      intro: "Sort by repeatedly swapping adjacent elements. (最簡單的排序方法)",
      method: "從頭到尾依次比較相鄰的元素，如果順序錯誤就交換，這樣最大的元素會逐步「冒泡」到最後。重複這個過程直到整個序列有序。",
      suitable: "Simple but inefficient."
    },
    Insertion: {
      name: "Insertion Sort",
      time: "O(n²)",
      space: "O(1)",
      intro: "Build sorted array one element at a time. (透過插入方式完成排序)",
      method: "從第二個元素開始，將當前元素與前面已排序的部分比較，找到合適的位置插入，並將比它大的元素往後移，直到整個序列有序。",
      suitable: "Small or nearly sorted arrays."
    },
    Merge: {
      name: "Merge Sort",
      time: "O(n log n)",
      space: "O(n)",
      intro: "Divide and conquer sorting algorithm. (穩定且高效的排序方法)",
      method: "將序列不斷二分成小組，直到每組只剩一個元素，然後逐步將兩組合併為有序序列，重複合併直到還原成完整有序序列。",
      suitable: "Stable and efficient."
    },
    Quick: {
      name: "Quick Sort",
      time: "O(n log n)",
      space: "O(log n)",
      intro: "Efficient divide-and-conquer sorting algorithm. (平均情況下最快的排序方法之一)",
      method: "選擇一個基準值（pivot），將序列分成比基準小和比基準大的兩部分，然後對兩部分遞迴排序，最後將它們合併起來。雖然效率高，但不穩定。",
      suitable: "Fast but unstable."
    },
    Huffman: {
      name: "Huffman Coding",
      time: "O(n log n)",
      space: "O(n)",
      intro: "Compression algorithm using variable-length prefix codes. (基於字元頻率的最佳編碼方式)",
      method: "計算每個字元的出現頻率，建立最小堆，反覆合併最小的兩個節點，形成一棵二元樹（Huffman Tree）。左分支通常賦予0，右分支賦予1，最終得到前綴碼表。高頻字元編碼較短，低頻字元編碼較長。",
      suitable: "Data compression, file encoding."
    },
    Activity: {
      name: "Activity Selection Problem",
      time: "O(n log n)",
      space: "O(1)",
      intro: "Select maximum number of non-overlapping activities. (經典貪心演算法)",
      method: "先將所有活動依照結束時間排序，從最早結束的活動開始選擇，之後只選擇與已選活動不衝突且最早結束的活動。重複這個過程直到沒有可選活動為止。",
      suitable: "Scheduling, resource allocation."
    },
    LCS: {
      name: "Longest Common Subsequence",
      time: "O(m*n)",
      space: "O(m*n)",
      intro: "Find the longest subsequence common to two strings. (經典動態規劃問題)",
      method: "建立二維 DP 表格，行代表字串A，列代表字串B。若當前字元相同，則取左上角值+1；否則取上或左的最大值。最終 DP 表格的右下角值就是最長公共子序列的長度。",
      suitable: "String comparison, bioinformatics."
    },
    Knapsack: {
      name: "0/1 Knapsack Problem",
      time: "O(n*W)",
      space: "O(n*W)",
      intro: "Maximize value without exceeding weight capacity. (典型的資源分配問題)",
      method: "使用動態規劃建立 DP 表格 `dp[i][w]`，表示前 i 個物品在容量 w 下的最大價值。遞推公式為：不放當前物品 → `dp[i-1][w]`；放當前物品 → `dp[i-1][w-wt[i]] + val[i]`；取兩者最大值。最後 `dp[n][W]` 為最佳解。",
      suitable: "Resource allocation, optimization."
    },
    "Floyd-Warshall": {
      name: "Floyd-Warshall Algorithm",
      time: "O(n^3)",
      space: "O(n^2)",
      intro: "Compute shortest paths between all pairs using DP. (使用動態規劃更新距離矩陣，能處理正/負權邊)",
      method: "建立距離矩陣 dist，初始值為邊的權重。對於每個中繼點 k，檢查是否通過 k 可以縮短從 i 到 j 的距離：若 `dist[i][j] > dist[i][k] + dist[k][j]`，則更新為後者。重複直到所有節點處理完，得到所有點對間的最短距離。",
      suitable: "All-pairs shortest paths, graph analysis."
    }
  };


  const info = infoMap[alg];
  if (!info) return;

  document.getElementById("details").innerHTML = `
    <h3>${info.name}</h3>
    <p><strong>Time Complexity:</strong> ${info.time}</p>
    <p><strong>Space Complexity:</strong> ${info.space}</p>
    <p><em>${info.intro}</em></p>
    <p><em>${info.method}</em></p>
    <p><strong>Suitable for:</strong> ${info.suitable}</p>
  `;
}

export function updateInfo(alg) {
  const infoMap = {
    BFS: {
      name: "Breadth-First Search",
      time: "O(V + E)",
      space: "O(V)",
      usage: "Level-order traversal using queue. (廣度優先搜尋)",
      suitable: "Shortest path in unweighted graphs."
    },
    DFS: {
      name: "Depth-First Search",
      time: "O(V + E)",
      space: "O(V)",
      usage: "Recursive deep traversal.  (深度優先搜尋)",
      suitable: "Cycle detection, topological sort."
    },
    Dijkstra: {
      name: "Dijkstra's Algorithm",
      time: "O((V + E) log V)",
      space: "O(V)",
      usage: "Shortest path in weighted graphs. (按照路徑權重加總優先搜尋)",
      suitable: "GPS, routing protocols."
    },
    Bubble: {
      name: "Bubble Sort",
      time: "O(n²)",
      space: "O(1)",
      usage: "Repeated adjacent swaps. (相鄰元素兩兩比較，大的往後移，小的往前冒，直到最大值逐步「冒泡」到最後)",
      suitable: "Simple but inefficient."
    },
    Insertion: {
      name: "Insertion Sort",
      time: "O(n²)",
      space: "O(1)",
      usage: "Insert into sorted part. (每次取出一個元素，插入到前面已排序好的部分，直到整個序列有序)",
      suitable: "Small or nearly sorted arrays."
    },
    Merge: {
      name: "Merge Sort",
      time: "O(n log n)",
      space: "O(n)",
      usage: "Divide and conquer merge. (先將序列不斷二分成小組，各自排序，再逐步合併成完整有序序列)",
      suitable: "Stable and efficient."
    },
    Quick: {
      name: "Quick Sort",
      time: "O(n log n)",
      space: "O(log n)",
      usage: "Partition and recurse. (選一個基準值，將序列分成比基準小與大的兩組，分別遞迴排序，最後合併)",
      suitable: "Fast but unstable."
    }
  };

  const info = infoMap[alg];
  if (!info) return;

  document.getElementById("details").innerHTML = `
    <h3>${info.name}</h3>
    <p><strong>Time Complexity:</strong> ${info.time}</p>
    <p><strong>Space Complexity:</strong> ${info.space}</p>
    <p><em>${info.usage}</em></p>
    <p><strong>Suitable for:</strong> ${info.suitable}</p>
  `;
}

export function updateInfo(alg) {
  const infoMap = {
    BFS: {
      name: "Breadth-First Search",
      time: "O(V + E)",
      space: "O(V)",
      usage: "Level-order traversal using queue.",
      suitable: "Shortest path in unweighted graphs."
    },
    DFS: {
      name: "Depth-First Search",
      time: "O(V + E)",
      space: "O(V)",
      usage: "Recursive deep traversal.",
      suitable: "Cycle detection, topological sort."
    },
    Dijkstra: {
      name: "Dijkstra's Algorithm",
      time: "O((V + E) log V)",
      space: "O(V)",
      usage: "Shortest path in weighted graphs.",
      suitable: "GPS, routing protocols."
    },
    Bubble: {
      name: "Bubble Sort",
      time: "O(n²)",
      space: "O(1)",
      usage: "Repeated adjacent swaps.",
      suitable: "Simple but inefficient."
    },
    Insertion: {
      name: "Insertion Sort",
      time: "O(n²)",
      space: "O(1)",
      usage: "Insert into sorted part.",
      suitable: "Small or nearly sorted arrays."
    },
    Merge: {
      name: "Merge Sort",
      time: "O(n log n)",
      space: "O(n)",
      usage: "Divide and conquer merge.",
      suitable: "Stable and efficient."
    },
    Quick: {
      name: "Quick Sort",
      time: "O(n log n)",
      space: "O(log n)",
      usage: "Partition and recurse.",
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

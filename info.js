export function updateInfo(alg) {
  const complexityInfo = {
    BFS: {
      name: "Breadth-First Search (BFS)",
      time: "Time Complexity: O(V + E)",
      space: "Space Complexity: O(V)",
      usage: "Explores nodes level by level using a queue.",
      suitable: "Best for shortest path in unweighted graphs, social network analysis, Biogo graph traversal."
    },
    DFS: {
      name: "Depth-First Search (DFS)",
      time: "Time Complexity: O(V + E)",
      space: "Space Complexity: O(V)",
      usage: "Explores as deep as possible before backtracking.",
      suitable: "Ideal for cycle detection, topological sorting, maze solving, and tree traversals."
    },
    Dijkstra: {
      name: "Dijkstra's Algorithm",
      time: "Time Complexity: O((V + E) log V)",
      space: "Space Complexity: O(V)",
      usage: "Finds shortest paths from a source node in weighted graphs.",
      suitable: "Used in GPS navigation, network routing, and weighted graph analysis."
    }
  };

  const info = complexityInfo[alg];
  if (!info) return;

  document.getElementById("details").innerHTML = `
    <h3>${info.name}</h3>
    <p><strong>${info.time}</strong></p>
    <p><strong>${info.space}</strong></p>
    <p><em>${info.usage}</em></p>
    <p><strong>Suitable for:</strong> ${info.suitable}</p>
  `;
}

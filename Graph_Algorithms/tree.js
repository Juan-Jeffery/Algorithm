export let currentRoot = null;
let animationQueue = [];
const svg = d3.select("#graph");
const width = +svg.attr("width"), height = +svg.attr("height");
const morandiBlue = "#A7C7E7";
const morandiYellow = "#E6D08C";

const treeData = {
  name: "Root", category: "A",
  children: [
    {
      name: "Level2-A", category: "B", weight: 2,
      children: [
        {
          name: "Level3-A1", category: "C", weight: 2,
          children: [
            { name: "Leaf-A1-1", category: "A", weight: 2 },
            { name: "Leaf-A1-2", category: "B", weight: 2 }
          ]
        },
        {
          name: "Level3-A2", category: "B", weight: 2,
          children: [
            { name: "Leaf-A2-1", category: "C", weight: 2 },
            { name: "Leaf-A2-2", category: "A", weight: 2 }
          ]
        }
      ]
    },
    {
      name: "Level2-B", category: "C", weight: 1,
      children: [
        {
          name: "Level3-B1", category: "A", weight: 2,
          children: [
            { name: "Leaf-B1-1", category: "B", weight: 2 },
            { name: "Leaf-B1-2", category: "C", weight: 2 }
          ]
        },
        {
          name: "Level3-B2", category: "C", weight: 1,
          children: [
            { name: "Leaf-B2-1", category: "A", weight: 1 },
            { name: "Leaf-B2-2", category: "B", weight: 2 }
          ]
        }
      ]
    }
  ]
};

export function drawTree() {
  svg.selectAll("*").remove();
  const root = d3.hierarchy(treeData);
  d3.tree().size([width - 100, height - 100])(root);
  currentRoot = root;

  svg.selectAll("line")
    .data(root.links())
    .enter()
    .append("line")
    .attr("x1", d => d.source.x + 50)
    .attr("y1", d => d.source.y + 50)
    .attr("x2", d => d.target.x + 50)
    .attr("y2", d => d.target.y + 50)
    .attr("stroke", "#999")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.6)
    .attr("stroke-linecap", "round");

  svg.selectAll("circle")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("cx", d => d.x + 50)
    .attr("cy", d => d.y + 50)
    .attr("r", 25)
    .attr("fill", morandiBlue)
    .attr("stroke", "#34495e")
    .attr("stroke-width", 2)
    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let labelIndex = 0;

  svg.selectAll("text.node-label")
    .data(root.descendants())
    .enter()
    .append("text")
    .attr("class", "node-label")
    .attr("x", d => d.x + 50)
    .attr("y", d => d.y + 55)
    .attr("text-anchor", "middle")
    //.attr("font-size", "1px")
    .attr("fill", "#2c3e50")
    .text(d => labels[labelIndex++]);


  svg.selectAll(".edge-label")
    .data(root.links())
    .enter()
    .append("text")
    .attr("class", "edge-label")
    .attr("x", d => (d.source.x + d.target.x)/2 + 50)
    .attr("y", d => (d.source.y + d.target.y)/2 + 50 - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("fill", "#2980b9")
    .style("font-weight", "bold")
    .text(d => `${d.target.data.weight || 1}`);
}

export function runAlgorithm(alg) {
  animationQueue.forEach(id => clearTimeout(id));
  animationQueue = [];

  svg.selectAll("circle")
    .interrupt()
    .attr("fill", morandiBlue);

  let order = [];

  if (alg === "BFS") {
    const queue = [currentRoot];
    while (queue.length > 0) {
      const node = queue.shift();
      order.push(node);
      if (node.children) queue.push(...node.children);
    }
  } else if (alg === "DFS") {
    function dfs(node) {
      order.push(node);
      if (node.children) node.children.forEach(dfs);
    }
    dfs(currentRoot);
  }else if(alg==="Dijkstra"){
    // Dijkstra: 單源最短路徑 (依據 weight 欄位)
    const nodes = currentRoot.descendants();
    const dist = {};
    nodes.forEach(n => dist[n.data.name] = Infinity);
    dist[currentRoot.data.name] = 0;
    const visited = new Set();
    let visitOrder = [];
    while(visited.size < nodes.length){
      // 找未訪問且距離最小的節點
      let minNode = null, minDist = Infinity;
      nodes.forEach(n => {
        if(!visited.has(n.data.name) && dist[n.data.name] < minDist){
          minDist = dist[n.data.name];
          minNode = n;
        }
      });
      if(!minNode) break;
      visited.add(minNode.data.name);
      visitOrder.push(minNode);
      // 更新鄰居距離
      if(minNode.children){
        minNode.children.forEach(child => {
          const w = child.data.weight || 1;
          if(dist[child.data.name] > dist[minNode.data.name] + w){
            dist[child.data.name] = dist[minNode.data.name] + w;
          }
        });
      }
      // 也可以往 parent 更新（如果是無向圖）
      if(minNode.parent){
        const w = minNode.data.weight || 1;
        if(dist[minNode.parent.data.name] > dist[minNode.data.name] + w){
          dist[minNode.parent.data.name] = dist[minNode.data.name] + w;
        }
      }
    }
    order = visitOrder;
  }

  // 動畫高亮
  order.forEach((node,i)=>{
    const id = setTimeout(()=>{
      svg.selectAll("circle")
        .filter(d=>d===node)
        .transition()
        .duration(300)
        .attr("fill", morandiYellow);
    }, i*400);
    animationQueue.push(id);
  });
}

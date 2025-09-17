<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Algorithm Tree Visualization</title>
<script src="https://d3js.org/d3.v7.min.js"></script>
<style>
  body { display: flex; font-family: sans-serif; }
  svg { border: 1px solid #ccc; }
  .tooltip { display: none; position: absolute; background: white; border: 1px solid #333; padding: 5px; }
  .grid-node { stroke: #333; fill: lightgray; }
</style>
</head>
<body>
  <!-- 樹狀圖 SVG -->
  <svg id="tree" width="300" height="400"></svg>
  <!-- 動態演算法 SVG -->
  <svg id="animation" width="300" height="400"></svg>

<script>
const treeData = {
  name: "Graph Algorithms",
  children: [
    { name: "BFS" },
    { name: "DFS" },
    { name: "Dijkstra" }
  ]
};

// ------------------ 樹狀圖 ------------------
const treeSvg = d3.select("#tree");
const width = +treeSvg.attr("width");
const height = +treeSvg.attr("height");

const root = d3.hierarchy(treeData);
const treeLayout = d3.tree().size([width-50, height-50]);
treeLayout(root);

// 畫線
treeSvg.selectAll("line")
  .data(root.links())
  .enter()
  .append("line")
  .attr("x1", d => d.source.x+25)
  .attr("y1", d => d.source.y+25)
  .attr("x2", d => d.target.x+25)
  .attr("y2", d => d.target.y+25)
  .attr("stroke", "black");

// 畫節點
treeSvg.selectAll("circle")
  .data(root.descendants())
  .enter()
  .append("circle")
  .attr("cx", d => d.x+25)
  .attr("cy", d => d.y+25)
  .attr("r", 20)
  .attr("fill", "lightblue")
  .attr("stroke", "black")
  .on("click", (event, d) => runAlgorithm(d.data.name));

// 標文字
treeSvg.selectAll("text")
  .data(root.descendants())
  .enter()
  .append("text")
  .attr("x", d => d.x+25)
  .attr("y", d => d.y+30)
  .attr("text-anchor", "middle")
  .text(d => d.data.name);

// ------------------ 演算法動畫 ------------------
const animSvg = d3.select("#animation");
const gridSize = 5;
const cellSize = 40;

function drawGrid() {
  const nodes = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      nodes.push({ x: j, y: i });
    }
  }
  animSvg.selectAll("rect").remove();
  animSvg.selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("x", d => d.x * cellSize + 20)
    .attr("y", d => d.y * cellSize + 20)
    .attr("width", cellSize-2)
    .attr("height", cellSize-2)
    .attr("class", "grid-node");
}

// 演算法動畫
function runAlgorithm(name) {
  drawGrid();
  const delay = 300;
  let order = [];

  if (name === "BFS") {
    // BFS 先橫向後縱向
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        order.push({x:j, y:i});
      }
    }
  } else if (name === "DFS") {
    // DFS 先深度探索
    for (let j = 0; j < gridSize; j++) {
      for (let i = 0; i < gridSize; i++) {
        order.push({x:j, y:i});
      }
    }
  } else if (name === "Dijkstra") {
    // 模擬權重最小先探索
    let vals = [];
    for (let i = 0; i < gridSize; i++)
      for (let j = 0; j < gridSize; j++)
        vals.push({x:j,y:i,v:i+j});
    order = vals.sort((a,b)=>a.v-b.v);
  }

  animSvg.selectAll("rect")
    .transition()
    .duration(delay)
    .delay((d,i)=> i*delay)
    .attr("fill", (d,i) => "orange");
}

drawGrid();
</script>
</body>
</html>

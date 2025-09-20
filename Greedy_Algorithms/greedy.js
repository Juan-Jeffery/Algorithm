import { newTask, schedule, getCurrentTaskId } from "../taskManager.js";

export function drawGreedy() {
  const svg = d3.select("#graph");
  svg.selectAll("*").interrupt().remove();
}

export function runGreedy(alg) {
  const svg = d3.select("#graph");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const delay = 600;

  const taskId = newTask(); // 🔑 新任務 ID，每次 runGreedy 都會自動停止舊動畫

  drawGreedy(); // 清空畫面

  if (alg === "Huffman") {
    const data = [
      { char: 'A', freq: 5 },
      { char: 'B', freq: 9 },
      { char: 'C', freq: 12 },
      { char: 'D', freq: 13 },
      { char: 'E', freq: 16 },
      { char: 'F', freq: 45 }
    ];

    let nodes = data.map(d => ({ name: d.char, freq: d.freq }));
    let steps = [];

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      const parent = {
        name: `${left.name}${right.name}`,
        freq: left.freq + right.freq,
        children: [left, right]
      };
      nodes.push(parent);
      steps.push(parent);
    }

    const root = d3.hierarchy(steps[steps.length - 1]);
    d3.tree().size([width - 100, height - 100])(root);

    root.descendants().forEach((node, i) => {
      schedule(() => {
        if (taskId !== getCurrentTaskId()) return; // 舊動畫停止

        // 畫線
        svg.selectAll("line.step" + i)
          .data(node.children ? node.children.map(c => ({ source: node, target: c })) : [])
          .enter()
          .append("line")
          .attr("class", "step" + i)
          .attr("x1", d => d.source.x + 50)
          .attr("y1", d => d.source.y + 50)
          .attr("x2", d => d.source.x + 50)
          .attr("y2", d => d.source.y + 50)
          .attr("stroke", "#999")
          .attr("stroke-width", 2)
          .transition()
          .duration(500)
          .attr("x2", d => d.target.x + 50)
          .attr("y2", d => d.target.y + 50);

        // 畫節點
        svg.append("circle")
          .attr("cx", node.x + 50)
          .attr("cy", node.y + 50)
          .attr("r", 0)
          .attr("fill", "#A7C7E7")
          .attr("stroke", "#34495e")
          .attr("stroke-width", 2)
          .transition()
          .duration(500)
          .attr("r", 25);

        // 節點標籤
        svg.append("text")
          .attr("x", node.x + 50)
          .attr("y", node.y + 55)
          .attr("opacity", 0)
          .attr("text-anchor", "middle")
          .attr("font-size", "13px")
          .text(`${node.data.name} (${node.data.freq})`)
          .transition()
          .duration(500)
          .attr("opacity", 1);

      }, i * delay, taskId);
    });

  } else if (alg === "Activity") {
    const activities = [
      { start: 1, end: 4 },
      { start: 3, end: 5 },
      { start: 0, end: 6 },
      { start: 5, end: 7 },
      { start: 8, end: 9 },
      { start: 5, end: 9 }
    ];

    const sorted = activities.slice().sort((a, b) => a.end - b.end);
    const selected = [];
    let lastEnd = -1;

    sorted.forEach(act => {
      if (act.start >= lastEnd) {
        selected.push(act);
        lastEnd = act.end;
      }
    });

    // 畫軸
    svg.append("line")
      .attr("x1", 50)
      .attr("y1", 30)
      .attr("x2", 800)
      .attr("y2", 30)
      .attr("stroke", "#444")
      .attr("stroke-width", 2);

    // 畫活動
    svg.selectAll("rect")
      .data(activities)
      .enter()
      .append("rect")
      .attr("x", d => d.start * 80 + 50)
      .attr("y", (_, i) => i * 40 + 50)
      .attr("width", d => (d.end - d.start) * 80)
      .attr("height", 30)
      .attr("fill", "#ccc")
      .attr("stroke", "#333");

    svg.selectAll("text")
      .data(activities)
      .enter()
      .append("text")
      .attr("x", d => d.start * 80 + 55)
      .attr("y", (_, i) => i * 40 + 70)
      .attr("font-size", "12px")
      .text(d => `[${d.start}, ${d.end}]`);

    // 高亮選擇的活動
    selected.forEach((act, i) => {
      schedule(() => {
        if (taskId !== getCurrentTaskId()) return; // 舊動畫停止

        svg.selectAll("rect")
          .filter(d => d.start === act.start && d.end === act.end)
          .transition().duration(300)
          .attr("fill", "#f39c12")
          .transition().duration(300)
          .attr("fill", "#1abc9c");

      }, i * delay, taskId);
    });
  }
}

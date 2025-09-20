import { newTask, getCurrentTaskId } from "../taskManager.js";

let animationQueue = [];

let currentTask = 0;

export function drawDP() {
  const svg = d3.select("#graph");
  svg.selectAll("*").interrupt().remove();
  // 清理所有動畫排程
  animationQueue.forEach(id => clearTimeout(id));
  animationQueue = [];
}

function createGrid(svg, rows, cols, cellSize, offsetX = 50, offsetY = 50) {
  const cells = Array.from({ length: rows }, () => []);
  const texts = Array.from({ length: rows }, () => []);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const rect = svg.append("rect")
        .attr("x", offsetX + j * cellSize)
        .attr("y", offsetY + i * cellSize)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", "#ccc")
        .attr("stroke", "#333");

      const text = svg.append("text")
        .attr("x", offsetX + j * cellSize + cellSize / 2)
        .attr("y", offsetY + i * cellSize + cellSize / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("0");

      cells[i][j] = rect;
      texts[i][j] = text;
    }
  }

  return { cells, texts };
}

export function runDP(alg) {
  newTask();
  drawDP();
  const taskId = getCurrentTaskId();
  const svg = d3.select("#graph");
  const delay = 400;

  if (alg === "LCS") {
    const X = "AGGTAB";
    const Y = "GXTXAYB";
    const m = X.length, n = Y.length;
    const cellSize = 40;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // 標籤
    for (let j = 0; j < n; j++)
      svg.append("text")
        .attr("x", (j + 1) * cellSize + 50 + cellSize / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text(Y[j]);
    for (let i = 0; i < m; i++)
      svg.append("text")
        .attr("x", 30)
        .attr("y", (i + 1) * cellSize + 50 + cellSize / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text(X[i]);

    const { cells, texts } = createGrid(svg, m + 1, n + 1, cellSize);

    let i = 1, j = 1;
    function fillNext() {
      if (taskId !== getCurrentTaskId()) return;
      if (i <= m) {
        if (j <= n) {
          dp[i][j] = X[i - 1] === Y[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

          cells[i][j].transition().duration(delay / 2)
            .attr("fill", "#f39c12")
            .transition().duration(delay / 2)
            .attr("fill", "#1abc9c");

          texts[i][j].transition().duration(delay).text(dp[i][j]);

          j++;
          animationQueue.push(setTimeout(fillNext, delay));
        } else {
          j = 1;
          i++;
          animationQueue.push(setTimeout(fillNext, delay));
        }
      } else {
        svg.append("text")
          .attr("x", n * cellSize + 100)
          .attr("y", m * cellSize + 130)
          .attr("font-size", "16px")
          .attr("fill", "#e74c3c")
          .text(`LCS Length: ${dp[m][n]}`);

        // 標記每個 col 最大值第一次出現的格子為深綠色
        for (let col = 0; col <= n; col++) {
          let maxVal = -Infinity, firstRow = null;
          for (let row = 1; row <= m; row++) {
            if (dp[row][col] > maxVal) {
              maxVal = dp[row][col];
              firstRow = row;
            }
          }
          // 先全部恢復正常綠色
          for (let row = 1; row <= m; row++) {
            cells[row][col].attr("fill", "#1abc9c");
          }
          // 只標第一次出現最大值的格子
          if (firstRow !== null) {
            cells[firstRow][col].attr("fill", "#168c6c");
          }
        }
        // 最右下格標最深綠色
        cells[m][n].attr("fill", "#0c5c3c")
      }
    }

    fillNext();
  }

  if (alg === "Knapsack") {
    const W = 7;
    const items = [
      { wt: 1, val: 1 },
      { wt: 3, val: 4 },
      { wt: 4, val: 5 },
      { wt: 5, val: 7 },
    ];
    const n = items.length;
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
    const cellSize = 50;

    // row 標籤：items 1~4
    for (let i = 0; i < n; i++) {
      svg.append("text")
        .attr("x", 30)
        .attr("y", (i + 1) * cellSize + 80)
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text(`${i + 1} items`);
      // 最右側顯示 wt/val
      svg.append("text")
        .attr("x", 100 + W * cellSize + 60)
        .attr("y", (i + 1) * cellSize + 80)
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
        .text(`wt:${items[i].wt}, val:${items[i].val}`);
    }
    // x軸單位標示
    svg.append("text")
      .attr("x", 100 + (W * cellSize) / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text("Weight (W)");

    for (let w = 0; w <= W; w++)
      svg.append("text")
        .attr("x", 100 + w * cellSize + cellSize / 2)
        .attr("y", 45)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(w);

  const { cells, texts } = createGrid(svg, n + 1, W + 1, cellSize, 100);

    let w = 0, i = 1;
    function fillNext() {
      if (taskId !== getCurrentTaskId()) return;
      if (w <= W) {
        if (i <= n) {
          const prev = dp[i - 1][w];
          let chosen = false;
          if (items[i - 1].wt <= w) {
            const tryVal = dp[i - 1][w - items[i - 1].wt] + items[i - 1].val;
            if (tryVal > prev) {
              dp[i][w] = tryVal;
              chosen = true;
            } else {
              dp[i][w] = prev;
            }
          } else {
            dp[i][w] = prev;
          }

          cells[i][w].transition().duration(delay / 2)
            .attr("fill", "#1abc9c");
          texts[i][w].transition().duration(delay).text(dp[i][w]);

          i++;
          animationQueue.push(setTimeout(fillNext, delay));
        } else {
          i = 1;
          w++;
          animationQueue.push(setTimeout(fillNext, delay));
        }
      } else {
        svg.append("text")
          .attr("x", W * cellSize + 100)
          .attr("y", n * cellSize + 130)
          .attr("font-size", "16px")
          .attr("fill", "#e74c3c")
          .text(`If weight = ${W}, Max Value: ${dp[n][W]}`);

        for (let w2 = 0; w2 <= W; w2++) {
          let maxVal = -Infinity, firstI = null;
          for (let i2 = 1; i2 <= n; i2++) {
            if (dp[i2][w2] > maxVal) {
              maxVal = dp[i2][w2];
              firstI = i2;
            }
          }
          // 先全部恢復正常綠色
          for (let i2 = 1; i2 <= n; i2++) {
            cells[i2][w2].attr("fill", "#1abc9c");
          }
          cells[n][W].attr("fill", "#0c5c3c");
          // 只標第一次出現最大值的格子
          if (firstI !== null) {
            cells[firstI][w2].attr("fill", "#168c6c");
          }
        }
      }
    }

    fillNext();
  }

  if (alg === "Floyd-Warshall") {
    const INF = 999;
    const graph = [
      [0, 3, INF, 7],
      [8, 0, 2, INF],
      [5, INF, 0, 1],
      [2, INF, INF, 0]
    ];
    const n = graph.length;
    const dist = graph.map(row => [...row]);
    const cellSize = 50;

    // 標籤
    for (let i = 0; i < n; i++) {
      svg.append("text")
        .attr("x", 30)
        .attr("y", i * cellSize + 80)
        .attr("font-size", "12px")
        .text(`V${i}`);
      svg.append("text")
        .attr("x", i * cellSize + 80)
        .attr("y", 40)
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .text(`V${i}`);
    }

    const { cells, texts } = createGrid(svg, n, n, cellSize);

    // 初始化格子
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        texts[i][j].text(dist[i][j] === INF ? "∞" : dist[i][j]);

    let k = 0, i = 0, j = 0;
    function fillNext() {
      if (taskId !== getCurrentTaskId()) return;
      if (k < n) {
        if (i < n) {
          if (j < n) {
            const newDist = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
            if (newDist !== dist[i][j]) {
              dist[i][j] = newDist;
              cells[i][j].transition().duration(delay / 2)
                .attr("fill", "#f39c12")
                .transition().duration(delay / 2)
                .attr("fill", "#1abc9c");
              texts[i][j].transition().duration(delay).text(dist[i][j]);
            }
            j++;
            animationQueue.push(setTimeout(fillNext, delay));
          } else {
            j = 0;
            i++;
            animationQueue.push(setTimeout(fillNext, delay));
          }
        } else {
          i = 0;
          k++;
          animationQueue.push(setTimeout(fillNext, delay));
        }
      } else {
        svg.append("text")
          .attr("x", n * cellSize + 100)
          .attr("y", n * cellSize + 100)
          .attr("font-size", "16px")
          .attr("fill", "#e74c3c")
          .text("Floyd-Warshall Done");
      }
    }

    fillNext();
  }
}

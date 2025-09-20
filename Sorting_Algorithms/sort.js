import { newTask, schedule, getCurrentTaskId } from "../taskManager.js";

export function drawBars() {
  const svg = d3.select("#graph");
  svg.selectAll("*").remove();

  // 產生不重複的 bar 高度
  const N = 20;
  let pool = Array.from({ length: 100 }, (_, i) => i + 10);
  let data = [];
  while (data.length < N) {
    const idx = Math.floor(Math.random() * pool.length);
    data.push(pool[idx]);
    pool.splice(idx, 1);
  }
  const barWidth = 30;
  const spacing = 5;

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (_, i) => i * (barWidth + spacing))
    .attr("y", d => 500 - d * 4)
    .attr("width", barWidth)
    .attr("height", d => d * 4)
    .attr("fill", "#A7C7E7")
    .attr("class", "bar")
    .attr("data-idx", (_, i) => i);
}

export function runSort(alg) {
  const svg = d3.select("#graph");
  const bars = svg.selectAll("rect").nodes();
  const values = bars.map(bar => parseInt(bar.getAttribute("height")) / 4);
  const delay = 400;
  const taskId = newTask(); // 🔑 新任務 ID，每次 runSort 都會自動停止舊動畫

  function swap(i, j) {
    const x_i = d3.select(bars[i]).attr("x");
    const x_j = d3.select(bars[j]).attr("x");
    d3.select(bars[i]).transition().duration(delay / 2).attr("x", x_j);
    d3.select(bars[j]).transition().duration(delay / 2).attr("x", x_i);

    [bars[i], bars[j]] = [bars[j], bars[i]];

    const idx_i = bars[i].getAttribute("data-idx");
    const idx_j = bars[j].getAttribute("data-idx");
    bars[i].setAttribute("data-idx", idx_j);
    bars[j].setAttribute("data-idx", idx_i);

    [values[i], values[j]] = [values[j], values[i]];
  }

  if (alg === "Bubble") {
    let i = 0, j = 0;
    function step() {
      if (taskId !== getCurrentTaskId()) return;
      if (i < values.length) {
        if (j < values.length - i - 1) {
          if (values[j] > values[j + 1]) swap(j, j + 1);
          j++;
          schedule(step, delay, taskId);
        } else {
          j = 0;
          i++;
          schedule(step, delay, taskId);
        }
      }
    }
    step();
  }

  if (alg === "Insertion") {
    let i = 1, j = 1;
    function step() {
      if (taskId !== getCurrentTaskId()) return;
      if (i < values.length) {
        if (j > 0 && values[j - 1] > values[j]) {
          swap(j - 1, j);
          j--;
          schedule(step, delay, taskId);
        } else {
          i++;
          j = i;
          schedule(step, delay, taskId);
        }
      }
    }
    step();
  }

  if (alg === "Merge") {
    let n = values.length;
    let size = 1;

    function merge(l, m, r, callback) {
      let i = l;
      let j = m + 1;

      function mergeStep() {
        if (taskId !== getCurrentTaskId()) return;

        if (i < j && j <= r) {
          if (values[i] <= values[j]) {
            i++;
          } else {
            // 把 values[j] 往前 swap 到 i 的位置
            let k = j;
            function shiftLeft() {
              if (k > i) {
                swap(k - 1, k);
                k--;
                schedule(shiftLeft, delay, taskId);
              } else {
                i++;
                j++;
                m++;
                schedule(mergeStep, delay, taskId);
              }
            }
            shiftLeft();
            return; // 等 shiftLeft 完成後再繼續
          }
          schedule(mergeStep, delay, taskId);
        } else {
          callback();
        }
      }

      mergeStep();
    }

    function step() {
      if (taskId !== getCurrentTaskId()) return;
      if (size < n) {
        let segments = [];
        for (let l = 0; l < n; l += 2 * size) {
          let m = Math.min(l + size - 1, n - 1);
          let r = Math.min(l + 2 * size - 1, n - 1);
          if (m < r) segments.push([l, m, r]);
        }

        function processNext() {
          if (segments.length === 0) {
            size *= 2;
            schedule(step, delay, taskId);
          } else {
            let [l, m, r] = segments.shift();
            merge(l, m, r, processNext);
          }
        }

        processNext();
      }
    }

    step();
  }

  if (alg === "Quick") {
    let stack = [[0, values.length - 1]];

    function step() {
      if (taskId !== getCurrentTaskId()) return;
      if (stack.length === 0) return;

      let [l, r] = stack.pop();
      if (l < r) {
        let pivot = values[r];
        let i = l;
        for (let j = l; j < r; j++) {
          if (values[j] < pivot) {
            [values[i], values[j]] = [values[j], values[i]];
            [bars[i], bars[j]] = [bars[j], bars[i]];
            d3.select(bars[i]).transition().duration(delay / 2).attr("x", i * 35).attr("data-idx", i);
            d3.select(bars[j]).transition().duration(delay / 2).attr("x", j * 35).attr("data-idx", j);
            i++;
          }
        }
        [values[i], values[r]] = [values[r], values[i]];
        [bars[i], bars[r]] = [bars[r], bars[i]];
        d3.select(bars[i]).transition().duration(delay / 2).attr("x", i * 35).attr("data-idx", i);
        d3.select(bars[r]).transition().duration(delay / 2).attr("x", r * 35).attr("data-idx", r);

        stack.push([l, i - 1]);
        stack.push([i + 1, r]);
      }
      schedule(step, delay, taskId);
    }
    step();
  }
}

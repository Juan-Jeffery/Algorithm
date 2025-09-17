export function drawBars() {
  const svg = d3.select("#graph");
  svg.selectAll("*").remove();

  // 產生不重複的 bar 高度
  const N = 10;
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

  const delay = 600;

  function swap(i, j) {
    // 交換 x 座標
    const x_i = d3.select(bars[i]).attr("x");
    const x_j = d3.select(bars[j]).attr("x");
    d3.select(bars[i])
      .transition().duration(delay)
      .attr("x", x_j);
    d3.select(bars[j])
      .transition().duration(delay)
      .attr("x", x_i);
    // 交換 bars 陣列順序
    [bars[i], bars[j]] = [bars[j], bars[i]];
    // 交換 data-idx 屬性
    const idx_i = bars[i].getAttribute("data-idx");
    const idx_j = bars[j].getAttribute("data-idx");
    bars[i].setAttribute("data-idx", idx_j);
    bars[j].setAttribute("data-idx", idx_i);
    // 交換 values
    [values[i], values[j]] = [values[j], values[i]];
  }

  if (alg === "Bubble") {
    let i = 0, j = 0;
    function step() {
      if (i < values.length) {
        if (j < values.length - i - 1) {
          if (values[j] > values[j + 1]) {
            // 交換 values
            [values[j], values[j + 1]] = [values[j + 1], values[j]];

            // 交換 bars 位置（保證 DOM 與 values 一致）
            [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];

            // 動畫交換 x 座標
            d3.select(bars[j])
              .transition().duration(delay)
              .attr("x", j * 35);
            d3.select(bars[j + 1])
              .transition().duration(delay)
              .attr("x", (j + 1) * 35);
            setTimeout(() => {
              j++;
              step();
            }, delay);
          } else {
            j++;
            setTimeout(step, delay);
          }
        } else {
          j = 0;
          i++;
          setTimeout(step, delay);
        }
      }
    }

    step();
  }

  if (alg === "Insertion") {
    let i = 1, j = 1;
    function step() {
      if (i < values.length) {
        if (j > 0 && values[j - 1] > values[j]) {
          swap(j - 1, j);
          j--;
          setTimeout(step, delay);
        } else {
          i++;
          j = i;
          setTimeout(step, delay);
        }
      }
    }
    step();
  }
  if (alg === "Merge") {
    // 使用 bottom-up 迭代式 merge sort 動畫
    let n = values.length;
    let size = 1;
    function merge(l, m, r) {
      let left = [];
      for (let i = l; i <= m; i++) left.push(values[i]);
      let right = [];
      for (let i = m + 1; i <= r; i++) right.push(values[i]);
      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
          values[k] = left[i];
          i++;
        } else {
          values[k] = right[j];
          j++;
        }
        k++;
      }
      while (i < left.length) {
        values[k++] = left[i++];
      }
      while (j < right.length) {
        values[k++] = right[j++];
      }
        // 合併完一段，根據 values 取得 bar 新順序（用高度+used陣列），並重排 bars 陣列
        let newBars = [];
        let used = [];
        for (let idx = l; idx <= r; idx++) {
          let target = bars.find((bar, bidx) => parseInt(bar.getAttribute("height")) / 4 === values[idx] && !used.includes(bidx));
          let barIdx = bars.indexOf(target);
          used.push(barIdx);
          newBars.push(target);
        }
        for (let idx = l; idx <= r; idx++) {
          bars[idx] = newBars[idx - l];
          d3.select(bars[idx])
            .transition().duration(delay/2)
            .attr("x", idx * 35);
          bars[idx].setAttribute("data-idx", idx);
        }
    }
    function step() {
      if (size < n) {
        for (let l = 0; l < n; l += 2 * size) {
          let m = Math.min(l + size - 1, n - 1);
          let r = Math.min(l + 2 * size - 1, n - 1);
          if (m < r) merge(l, m, r);
        }
        size *= 2;
        setTimeout(step, delay);
      }
    }
    step();
  }

  if (alg === "Quick") {
    // 非遞迴 quick sort 動畫
    let stack = [[0, values.length - 1]];

    function step() {
      if (stack.length === 0) return;

      setTimeout(() => {
        let [l, r] = stack.pop();
        if (l < r) {
          let pivot = values[r];
          let i = l;

          for (let j = l; j < r; j++) {
            if (values[j] < pivot) {
              // swap values
              [values[i], values[j]] = [values[j], values[i]];
              // swap bars 同步
              [bars[i], bars[j]] = [bars[j], bars[i]];
              updateBarsPosition(i, j);
              i++;
            }
          }

          // swap pivot
          [values[i], values[r]] = [values[r], values[i]];
          [bars[i], bars[r]] = [bars[r], bars[i]];
          updateBarsPosition(i, r);

          // push 左右區間
          stack.push([l, i - 1]);
          stack.push([i + 1, r]);
        }

        step();
      }, delay);
    }

    function updateBarsPosition(a, b) {
      d3.select(bars[a])
        .transition().duration(delay / 2)
        .attr("x", a * 35)
        .attr("data-idx", a);

      d3.select(bars[b])
        .transition().duration(delay / 2)
        .attr("x", b * 35)
        .attr("data-idx", b);
    }

    step();
  }
}
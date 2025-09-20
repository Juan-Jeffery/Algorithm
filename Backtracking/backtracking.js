import { newTask, schedule, getCurrentTaskId } from "../taskManager.js";
// runBacktracking.js
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// N-Queens Problem
async function runNQueens(n, visualizeStep) {
  let board = Array.from({ length: n }, () => Array(n).fill(0));
  function isSafe(row, col) {
    for (let i = 0; i < col; i++) if (board[row][i]) return false;
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (let i = row, j = col; i < n && j >= 0; i++, j--) if (board[i][j]) return false;
    return true;
  }
  async function solve(col) {
    if (col >= n) return true;
    for (let i = 0; i < n; i++) {
      if (isSafe(i, col)) {
        board[i][col] = 1;
        await visualizeStep(board);
        if (await solve(col + 1)) return true;
        board[i][col] = 0;
        await visualizeStep(board);
      }
    }
    return false;
  }
  await solve(0);
  return board;
}

// Sudoku Solver
async function runSudoku(board, visualizeStep) {
  const SIZE = 9;

  // 初始化行、列、3x3 宮格的數字集合
  const rows = Array.from({ length: SIZE }, () => new Set());
  const cols = Array.from({ length: SIZE }, () => new Set());
  const boxes = Array.from({ length: SIZE }, () => new Set());

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const num = board[r][c];
      if (num) {
        rows[r].add(num);
        cols[c].add(num);
        boxes[Math.floor(r/3)*3 + Math.floor(c/3)].add(num);
      }
    }
  }

  async function solve() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) {
          for (let num = 1; num <= 9; num++) {
            const b = Math.floor(r/3)*3 + Math.floor(c/3);
            if (!rows[r].has(num) && !cols[c].has(num) && !boxes[b].has(num)) {
              // 嘗試填入
              board[r][c] = num;
              rows[r].add(num);
              cols[c].add(num);
              boxes[b].add(num);
              await visualizeStep(board);

              if (await solve()) return true;

              // 回溯
              board[r][c] = 0;
              rows[r].delete(num);
              cols[c].delete(num);
              boxes[b].delete(num);
              await visualizeStep(board);
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  await solve();
  return board;
}


// Subset Sum Problem
async function runSubsetSum(nums, target, visualizeStep, offsetY = 0) {
  let found = false;
  let finalState = []; // 用來記錄最後成功的組合

  async function backtrack(start, current, remaining) {
    // 過程動畫只顯示 Remaining，不顯示 Result
    await visualizeStep([...current], remaining, null, target, offsetY);

    if (remaining === 0) {
      found = true;
      finalState = [...current]; // 記錄成功組合
      return true;
    }
    if (remaining < 0) return false;

    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      if (await backtrack(i + 1, current, remaining - nums[i])) return true;
      current.pop();
      await visualizeStep(current, remaining, null, target, offsetY);
    }
    return false;
  }

  await backtrack(0, [], target);

  // 顯示最終結果，保留題目文字、藍色方塊和 Result
  await visualizeStep(finalState, null, found, target, offsetY); 
  // remaining 參數傳 null，表示不再顯示 Remaining
  return found;
}




// 主函數
export async function runBacktracking(alg) {
  // 終止前一個任務，取得新任務 id
  const myTaskId = newTask();
  const svg = d3.select("#graph");
  svg.selectAll("*").remove(); // 清空整個 SVG
  let g = svg.append("g").attr("id", "backtracking-group");
  let cellSize = 50;

  async function visualizeStep(state, remaining, finished = null, target = null, offsetY = 0) {
    // 若被其他任務中斷，直接 return，不再執行動畫
    if (myTaskId !== getCurrentTaskId()) return;
    // 清空 group 內舊的步驟（step-group），但不清除 .answer-group
    g.selectAll(".step-group").remove();
    const group = g.append("g").attr("class", "step-group").attr("transform", `translate(0, ${offsetY})`);

    if (alg === "NQueens") {
      const flat = state.flatMap((row,i)=>row.map((v,j)=>({v,i,j})));
      g.selectAll("rect").data(flat)
        .join("rect")
        .attr("x", d=>d.j*cellSize)
        .attr("y", d=>d.i*cellSize)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", d=>(d.i+d.j)%2===0?"#fff":"#eee")
        .attr("stroke","#888");
      g.selectAll("circle").data(flat.filter(d=>d.v))
        .join("circle")
        .attr("cx", d=>d.j*cellSize+cellSize/2)
        .attr("cy", d=>d.i*cellSize+cellSize/2)
        .attr("r", cellSize/3)
        .attr("fill","#f77");
    } 
    else if (alg === "Sudoku") {
      const flat = state.flatMap((row,i)=>row.map((v,j)=>({v,i,j})));
      g.selectAll("rect").data(flat)
        .join("rect")
        .attr("x", d=>d.j*cellSize)
        .attr("y", d=>d.i*cellSize)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill","#fff")
        .attr("stroke", d=>((d.i%3===2 && d.j%3===2)?"#333":"#bbb"))
        .attr("stroke-width", d=>((d.i%3===2 && d.j%3===2)?2:1));
      g.selectAll("text").data(flat.filter(d=>d.v))
        .join("text")
        .attr("x", d=>d.j*cellSize+cellSize/2)
        .attr("y", d=>d.i*cellSize+cellSize/1.5)
        .attr("text-anchor","middle")
        .attr("font-size","20px")
        .attr("fill","#333")
        .text(d=>d.v);
    }
    else if (alg === "SubsetSum") {
      const nums = [3, 34, 4, 12, 5, 2];

      // 題目文字
      group.append("text")
        .attr("class","title")
        .attr("x", 0).attr("y", 15)
        .attr("font-size", "16px")
        .attr("fill", "#555")
        .text(`Nums: {${nums.join(", ")}}, Target: ${target}`);

      // 選中的數字
      group.selectAll("rect")
        .data(state)
        .join("rect")
        .attr("x", (d,i)=>i*(cellSize+10))
        .attr("y",30)
        .attr("width",cellSize)
        .attr("height",40)
        .attr("fill","#4da6ff")
        .attr("stroke","#333");

      group.selectAll("text.num")
        .data(state)
        .join("text")
        .attr("class","num")
        .attr("x", (d,i)=>i*(cellSize+10)+cellSize/2)
        .attr("y",55)
        .attr("text-anchor","middle")
        .attr("font-size","20px")
        .attr("fill","#fff")
        .text(d=>d);

      // Remaining 過程暫時顯示，完成後不保留
      if (finished === null) {
        group.append("text")
          .attr("class","remaining")
          .attr("x", 0)
          .attr("y", 90)
          .attr("font-size", "16px")
          .attr("fill", "#555")
          .text(`Remaining: ${remaining}`);
      }

      // 完成後保留答案
      if (finished !== null) {
        const answerGroup = g.append("g")
          .attr("class", "answer-group")
          .attr("transform", `translate(0, ${offsetY})`);
        // 題目文字
        answerGroup.append("text")
          .attr("class","title")
          .attr("x", 0).attr("y", 15)
          .attr("font-size", "16px")
          .attr("fill", "#555")
          .text(`Nums: {${nums.join(", ")}}, Target: ${target}`);
        // 藍色方塊
        answerGroup.selectAll("rect")
          .data(state)
          .join("rect")
          .attr("x", (d,i)=>i*(cellSize+10))
          .attr("y",30)
          .attr("width",cellSize)
          .attr("height",40)
          .attr("fill","#4da6ff")
          .attr("stroke","#333");
        answerGroup.selectAll("text.num")
          .data(state)
          .join("text")
          .attr("class","num")
          .attr("x", (d,i)=>i*(cellSize+10)+cellSize/2)
          .attr("y",55)
          .attr("text-anchor","middle")
          .attr("font-size","20px")
          .attr("fill","#fff")
          .text(d=>d);
        // Result
        answerGroup.append("text")
          .attr("class","result")
          .attr("x", 0)
          .attr("y", 120)
          .attr("font-size", "18px")
          .attr("fill", finished ? "green" : "red")
          .text(`Result: ${finished}`);
      }
    }

  // 動畫排程改用 schedule
  await new Promise(r => schedule(r, 300, myTaskId));
  }

  // 呼叫演算法
  if (alg === "NQueens") {
    await runNQueens(8, visualizeStep);
  } else if (alg === "Sudoku") {
    const board = [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9]
    ];
    await runSudoku(board, visualizeStep);
  } else if (alg === "SubsetSum") {
    await runSubsetSum([3, 34, 4, 12, 5, 2], 9, visualizeStep, 0);
    await new Promise(r => setTimeout(r, 500));
    await runSubsetSum([3, 34, 4, 12, 5, 2], 30, visualizeStep, 150);
  }
}

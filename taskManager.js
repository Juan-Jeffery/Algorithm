let currentTaskId = 0;
let timers = [];

export function newTask() {
  currentTaskId++;
  // 清除所有舊任務的排程
  timers.forEach(id => clearTimeout(id));
  timers = [];
  return currentTaskId;
}

export function schedule(fn, delay, taskId) {
  const id = setTimeout(() => {
    if (taskId === currentTaskId) {
      fn();
    }
  }, delay);
  timers.push(id);
}

export function getCurrentTaskId() {
  return currentTaskId;
}

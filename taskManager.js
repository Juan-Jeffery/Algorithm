// taskManager.js
let currentTaskId = 0;
let currentTimer = null;

export function newTask() {
  currentTaskId++;
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }
  return currentTaskId;
}

export function schedule(fn, delay, taskId) {
  currentTimer = setTimeout(() => {
    if (taskId === currentTaskId) {
      fn();
    }
  }, delay);
}

export function getCurrentTaskId() {
  return currentTaskId;
}

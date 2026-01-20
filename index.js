#!/usr/bin/env node
import { argv, exit } from "node:process";
import {
  addTask,
  deleteTask,
  listTasks,
  markDone,
  markInProgress,
  updateTask,
} from "./commands.js";
import { commands } from "./constants.js";

const command = argv[2];
const arg1 = argv[3];
const arg2 = argv[4];

const handleError = (errorMessage) => {
  console.error(errorMessage);
  exit();
};

const commandHandlers = {
  list: () => listTasks(arg1),
  add: () => (arg1 ? addTask(arg1) : handleError("Missing description")),
  delete: () => (arg1 ? deleteTask(arg1) : handleError("Missing task ID")),
  update: () =>
    arg1
      ? arg2
        ? updateTask(arg1)
        : handleError("Missing description")
      : handleError("Missing task ID"),
  "mark-in-progress": () =>
    arg1 ? markInProgress(arg1) : handleError("Missing task ID"),
  "mark-done": () => (arg1 ? markDone(arg1) : handleError("Missing task ID")),
};

if (commands.includes(command)) {
  await commandHandlers[command]();
} else {
  console.error("Unknown command! Please try again!");
  exit();
}

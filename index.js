#!/usr/bin/env node

const { readFile } = require("fs");
const { argv, exit } = require("node:process");

const commands = [
  "add",
  "update",
  "delete",
  "mark-in-progress",
  "mark-done",
  "list",
];

const statuses = ["done", "todo", "in-progress"];

const command = argv[2];
const arg1 = argv[3];
const arg2 = argv[4];

if (!commands.includes(command)) {
  console.error("Unknown command! Pease try again!");
  exit();
}

if (command === "list") {
  readFile("./index.json", "utf8", (err, data) => {
    if (err) throw err;
    const tasksList = JSON.parse(data).tasks;
    if (!tasksList || !tasksList.length) {
      console.error("No tasks found! Please create one:)");
      exit();
    }
    if (arg1) {
      if (statuses.includes(arg1)) {
        const filteredList = tasksList.filter((task) => task.status === arg1);
        console.log(`Tasks in status ${arg1}:`, filteredList);
        exit();
      } else {
        console.error("Incorrect status! Please try again:)");
        exit();
      }
    }
    console.log("All tasks:", tasksList);
    exit();
  });
}

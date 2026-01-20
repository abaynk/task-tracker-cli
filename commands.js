#!/usr/bin/env node
import { promises } from "fs";
const { readFile, writeFile } = promises;
import { exit } from "node:process";
import { statuses, TASKS_FILE } from "./constants.js";

const readTasks = async () => {
  try {
    const data = await readFile(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      const emptyTasks = [];
      await writeFile(TASKS_FILE, JSON.stringify(emptyTasks, null, 2));
      return emptyTasks;
    }
    throw error;
  }
};

const writeTasks = async (tasksList) => {
  await writeFile(TASKS_FILE, JSON.stringify(tasksList, null, 2));
};

export const listTasks = async (status) => {
  try {
    const tasksList = await readTasks();

    if (!tasksList || tasksList.length === 0) {
      console.log(
        'No tasks found! Please create one with: task-cli add "Your task"',
      );
      exit();
    }

    let filteredList = [...tasksList];

    if (status) {
      if (statuses.includes(status)) {
        filteredList = filteredList.filter((task) => task.status === status);
      } else {
        console.error("Incorrect status! Please try again:)");
        exit();
      }
    }

    console.log(
      status ? `Tasks in status ${status}:` : "All tasks:",
      filteredList.map(
        (task) => `${task.description}${status ? "" : ` - ${task.status}`}`,
      ),
    );
    exit();
  } catch (error) {
    console.error("Couldn't retrieve tasks! Please try again:)", error);
    exit();
  }
};

export const addTask = async (description) => {
  try {
    const tasksList = await readTasks();
    const id =
      tasksList.length === 0 ? 1 : tasksList[tasksList.length - 1].id + 1;

    const newTaskObj = {
      id,
      description,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasksList.push(newTaskObj);

    await writeTasks(tasksList);
    console.log(`Task added successfully (ID: ${newTaskObj.id})`);
  } catch (error) {
    console.error("Couldn't add task! Please try again!", error);
    exit();
  }
};

export const deleteTask = async (taskId) => {
  try {
    const tasksList = await readTasks();

    const updatedTasksList = tasksList.filter(
      (task) => task.id !== Number(taskId),
    );

    await writeTasks(updatedTasksList);
    console.log(`Task deleted successfully (ID: ${taskId})`);
  } catch (error) {
    console.error("Couldn't find this task! Please try again!", error);
    exit();
  }
};

export const updateTask = async (taskId, newDescription) => {
  try {
    const tasksList = await readTasks();

    const taskIndex = tasksList.findIndex((task) => task.id === Number(taskId));

    if (taskIndex === -1) {
      console.error("Could not find task by this id! Please try again!");
      return;
    }

    tasksList[taskIndex] = {
      ...tasksList[taskIndex],
      description: newDescription,
      updatedAt: new Date(),
    };

    await writeTasks(tasksList);
    console.log(`Task updated successfully (ID: ${taskId})`);
  } catch (error) {
    console.error("Couldn't find this task! Please try again!", error);
    exit();
  }
};

export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const tasksList = await readTasks();

    const taskIndex = tasksList.findIndex((task) => task.id === Number(taskId));

    if (taskIndex === -1) {
      console.error("Could not find task by this id! Please try again!");
      return;
    }

    tasksList[taskIndex] = {
      ...tasksList[taskIndex],
      status: newStatus,
      updatedAt: new Date(),
    };

    await writeTasks(tasksList);
    console.log(`Task status updated successfully to ${newStatus}`);
  } catch (error) {
    console.error("Couldn't find this task! Please try again!", error);
    exit();
  }
};

export const markInProgress = (taskId) =>
  updateTaskStatus(taskId, "in-progress");
export const markDone = (taskId) => updateTaskStatus(taskId, "done");

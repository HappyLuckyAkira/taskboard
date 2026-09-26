"use client";

import { useCallback, useReducer } from "react";
import { taskReducer } from "@/lib/taskReducer";
import type { Task, TaskStatus } from "@/types/task";

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  const addTask = useCallback((title: string, description: string) => {
    dispatch({ type: "add", id: crypto.randomUUID(), title, description });
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    dispatch({ type: "move", id, status });
  }, []);

  return { tasks, addTask, moveTask };
}

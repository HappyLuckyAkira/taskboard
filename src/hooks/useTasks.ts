"use client";

import { useCallback, useSyncExternalStore } from "react";
import { taskReducer, type TaskAction } from "@/lib/taskReducer";
import {
  getServerStoredTasks,
  getStoredTasks,
  saveTasks,
  subscribe,
} from "@/lib/taskStore";
import type { NewTaskInput, Task, TaskStatus } from "@/types/task";

const NO_TASKS: Task[] = [];

/**
 * タスク一覧を localStorage に保存しながら扱う。
 * 保存データが無いあいだは initialTasks を表示し、最初の変更から保存を始める。
 */
export function useTasks(initialTasks: Task[] = NO_TASKS) {
  const stored = useSyncExternalStore(
    subscribe,
    getStoredTasks,
    getServerStoredTasks,
  );
  const tasks = stored ?? initialTasks;

  const dispatch = useCallback(
    (action: TaskAction) => {
      // 描画時点の値ではなくストアの最新値から次の状態を作る
      const current = getStoredTasks() ?? initialTasks;
      const next = taskReducer(current, action);
      if (next !== current) saveTasks(next);
    },
    [initialTasks],
  );

  const addTask = useCallback(
    (input: NewTaskInput, status?: TaskStatus) => {
      dispatch({ type: "add", id: crypto.randomUUID(), ...input, status });
    },
    [dispatch],
  );

  const moveTask = useCallback(
    (id: string, status: TaskStatus) => {
      dispatch({ type: "move", id, status });
    },
    [dispatch],
  );

  return { tasks, addTask, moveTask };
}

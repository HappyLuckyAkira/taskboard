import {
  DEFAULT_PRIORITY,
  type Priority,
  type Task,
  type TaskStatus,
} from "@/types/task";

export type TaskAction =
  | {
      type: "add";
      id: string;
      title: string;
      description: string;
      status?: TaskStatus;
      assignee?: string;
      priority?: Priority;
      dueDate?: string;
    }
  | { type: "move"; id: string; status: TaskStatus };

/**
 * タスク一覧の状態遷移を扱う純粋関数。
 * UI から切り離しておくことでユニットテストしやすくしている。
 */
export function taskReducer(tasks: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add": {
      const title = action.title.trim();
      if (title === "") return tasks;
      return [
        ...tasks,
        {
          id: action.id,
          title,
          description: action.description.trim(),
          status: action.status ?? "todo",
          assignee: (action.assignee ?? "").trim(),
          priority: action.priority ?? DEFAULT_PRIORITY,
          dueDate: action.dueDate ?? "",
        },
      ];
    }
    case "move": {
      const target = tasks.find((t) => t.id === action.id);
      if (!target || target.status === action.status) return tasks;
      // 移動したタスクは移動先の列の末尾に並ぶよう、配列の末尾へ移す
      return [
        ...tasks.filter((t) => t.id !== action.id),
        { ...target, status: action.status },
      ];
    }
  }
}

export function tasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((t) => t.status === status);
}

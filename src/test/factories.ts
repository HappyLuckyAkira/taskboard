import type { Task } from "@/types/task";

/** テスト用のタスク。指定しなかった項目は既定値で埋める */
export function makeTask(overrides: Partial<Task> & Pick<Task, "id">): Task {
  return {
    title: `タスク${overrides.id}`,
    description: "",
    status: "todo",
    assignee: "",
    priority: "medium",
    dueDate: "",
    ...overrides,
  };
}

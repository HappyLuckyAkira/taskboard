export type TaskStatus = "todo" | "in-progress" | "on-hold" | "done";

export type Priority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  /** 空文字は未割り当て */
  assignee: string;
  priority: Priority;
  /** `YYYY-MM-DD` 形式。空文字は期限なし */
  dueDate: string;
};

/** タスク追加フォームの入力値 */
export type NewTaskInput = Pick<
  Task,
  "title" | "description" | "assignee" | "priority" | "dueDate"
>;

export type Column = {
  status: TaskStatus;
  label: string;
};

export const COLUMNS: readonly Column[] = [
  { status: "todo", label: "未着手" },
  { status: "in-progress", label: "進行中" },
  { status: "on-hold", label: "保留" },
  { status: "done", label: "完了" },
];

export const PRIORITIES: readonly { value: Priority; label: string }[] = [
  { value: "high", label: "高" },
  { value: "medium", label: "中" },
  { value: "low", label: "低" },
];

export const DEFAULT_PRIORITY: Priority = "medium";

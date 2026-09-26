export type TaskStatus = "todo" | "in-progress" | "on-hold" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

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

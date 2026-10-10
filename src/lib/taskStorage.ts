import {
  COLUMNS,
  DEFAULT_PRIORITY,
  PRIORITIES,
  type Task,
} from "@/types/task";

export const STORAGE_KEY = "taskboard:tasks:v1";

/** 読み書きに使う最小限のストレージ（`localStorage` を想定） */
export type TaskStorage = Pick<Storage, "getItem" | "setItem">;

const STATUSES = new Set<string>(COLUMNS.map((c) => c.status));
const PRIORITY_VALUES = new Set<string>(PRIORITIES.map((p) => p.value));

const asString = (value: unknown) => (typeof value === "string" ? value : "");

/** 保存データ 1 件をタスクに戻す。必須項目や値が不正なら null */
function toTask(value: unknown): Task | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.title !== "string") return null;
  if (typeof v.status !== "string" || !STATUSES.has(v.status)) return null;
  // 担当者・優先度・期限を持たない古いデータは既定値で補う
  const priority = v.priority ?? DEFAULT_PRIORITY;
  if (typeof priority !== "string" || !PRIORITY_VALUES.has(priority)) {
    return null;
  }
  return {
    id: v.id,
    title: v.title,
    description: asString(v.description),
    status: v.status as Task["status"],
    assignee: asString(v.assignee),
    priority: priority as Task["priority"],
    dueDate: asString(v.dueDate),
  };
}

/** 保存された JSON 文字列をタスク一覧にする。読めないデータは空配列 */
export function parseTasks(raw: string): Task[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.map(toTask).filter((t): t is Task => t !== null);
}

/** 保存データが無い、またはストレージが使えない場合は null */
export function readTasks(storage: TaskStorage): Task[] | null {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  return raw === null ? null : parseTasks(raw);
}

/** ストレージが使えない（容量超過・プライベートモード等）ときは保存を諦める */
export function writeTasks(storage: TaskStorage, tasks: Task[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // 保存できなくても画面上の操作は続けられるようにする
  }
}

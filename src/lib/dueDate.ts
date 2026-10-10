import type { TaskStatus } from "@/types/task";

/** ローカル時刻の日付を `YYYY-MM-DD` にする（`toISOString` は UTC になるので使わない） */
export function toDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 完了以外で、期限が今日より前なら期限切れ。日付は `YYYY-MM-DD` なので文字列比較できる */
export function isOverdue(
  dueDate: string,
  today: string,
  status: TaskStatus,
): boolean {
  return dueDate !== "" && status !== "done" && dueDate < today;
}

/** `2026-03-05` → `3/5` */
export function formatDueDate(dueDate: string): string {
  const [, month, day] = dueDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

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

/** 期限の何日前から「期限間近」とするか */
export const DUE_SOON_DAYS = 3;

/** `YYYY-MM-DD` を UTC の通日に直す（タイムゾーンや夏時間で 1 日ずれないように） */
function toDayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

/** 今日から期限までの暦の日数。期限を過ぎていれば負 */
export function daysUntil(dueDate: string, today: string): number {
  return toDayNumber(dueDate) - toDayNumber(today);
}

/** 期限間近なら残り日数の表示文言、そうでなければ null */
export function dueSoonLabel(
  dueDate: string,
  today: string,
  status: TaskStatus,
): string | null {
  if (dueDate === "" || status === "done") return null;
  const days = daysUntil(dueDate, today);
  if (days < 0 || days > DUE_SOON_DAYS) return null;
  if (days === 0) return "今日まで";
  if (days === 1) return "明日まで";
  return `あと${days}日`;
}

/** `2026-03-05` → `3/5` */
export function formatDueDate(dueDate: string): string {
  const [, month, day] = dueDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}

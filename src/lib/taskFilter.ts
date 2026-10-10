import type { Priority, Task } from "@/types/task";

/**
 * 担当者フィルターで「未割り当て」を表す値。
 * `<option value>` としてサーバー描画の HTML を通るので、制御文字は使えない（NUL は U+FFFD に置き換わる）。
 */
export const UNASSIGNED = "__unassigned__";

export type TaskFilter = {
  /** タイトル・説明を対象にしたキーワード */
  query: string;
  /** `""` はすべて、`UNASSIGNED` は未割り当てのみ */
  assignee: string;
  /** `""` はすべて */
  priority: Priority | "";
};

export const EMPTY_FILTER: TaskFilter = { query: "", assignee: "", priority: "" };

export function isFiltering(filter: TaskFilter): boolean {
  return (
    filter.query.trim() !== "" || filter.assignee !== "" || filter.priority !== ""
  );
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  if (!isFiltering(filter)) return tasks;
  const query = filter.query.trim().toLowerCase();
  const assignee = filter.assignee === UNASSIGNED ? "" : filter.assignee;

  return tasks.filter(
    (t) =>
      (query === "" ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)) &&
      (filter.assignee === "" || t.assignee === assignee) &&
      (filter.priority === "" || t.priority === filter.priority),
  );
}

/** 担当者名の一覧（重複なし・五十音順、未割り当ては含めない） */
export function listAssignees(tasks: Task[]): string[] {
  const names = new Set(tasks.map((t) => t.assignee).filter((a) => a !== ""));
  return [...names].sort((a, b) => a.localeCompare(b, "ja"));
}

import {
  EMPTY_FILTER,
  isFiltering,
  UNASSIGNED,
  type TaskFilter,
} from "@/lib/taskFilter";
import { PRIORITIES, type Priority } from "@/types/task";

type Props = {
  filter: TaskFilter;
  /** 担当者の選択肢（既存タスクの担当者） */
  assigneeOptions: readonly string[];
  onChange: (filter: TaskFilter) => void;
};

const fieldClass =
  "rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/40";

export function TaskFilters({ filter, assigneeOptions, onChange }: Props) {
  return (
    <div
      role="search"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <label className="flex flex-1 flex-col gap-1.5 text-sm sm:min-w-56">
        <span className="text-muted">検索</span>
        <input
          type="search"
          value={filter.query}
          onChange={(e) => onChange({ ...filter, query: e.target.value })}
          placeholder="タイトル・説明"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm sm:w-44">
        <span className="text-muted">担当者</span>
        <select
          value={filter.assignee}
          onChange={(e) => onChange({ ...filter, assignee: e.target.value })}
          className={fieldClass}
        >
          <option value="">すべて</option>
          <option value={UNASSIGNED}>未割り当て</option>
          {assigneeOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm sm:w-32">
        <span className="text-muted">優先度</span>
        <select
          value={filter.priority}
          onChange={(e) =>
            onChange({ ...filter, priority: e.target.value as Priority | "" })
          }
          className={fieldClass}
        >
          <option value="">すべて</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      {isFiltering(filter) && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTER)}
          className="self-start rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground sm:self-end"
        >
          条件をクリア
        </button>
      )}
    </div>
  );
}

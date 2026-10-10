import { PlusIcon } from "./icons";

type Props = {
  taskCount: number;
  /** 絞り込み中に表示しているタスク数。絞り込みしていなければ undefined */
  visibleCount?: number;
  onNewTask: () => void;
};

export function BoardHeader({ taskCount, visibleCount, onNewTask }: Props) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          TaskBoard
        </h1>
        <p className="whitespace-nowrap text-sm text-muted">
          {visibleCount === undefined
            ? `${taskCount}件のタスク`
            : `${taskCount}件中${visibleCount}件を表示`}
        </p>
      </div>
      <button
        type="button"
        onClick={onNewTask}
        className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 sm:px-5"
      >
        <PlusIcon />
        新規タスク
      </button>
    </header>
  );
}

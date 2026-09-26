import { PlusIcon } from "./icons";

type Props = {
  taskCount: number;
  onNewTask: () => void;
};

export function BoardHeader({ taskCount, onNewTask }: Props) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          TaskBoard
        </h1>
        <p className="whitespace-nowrap text-sm text-muted">
          {taskCount}件のタスク
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

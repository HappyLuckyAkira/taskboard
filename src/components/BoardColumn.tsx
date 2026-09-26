"use client";

import { useState, type DragEvent } from "react";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import type { Column, Task, TaskStatus } from "@/types/task";
import { MoreIcon, PlusIcon } from "./icons";
import { TaskCard } from "./TaskCard";

type Props = {
  column: Column;
  tasks: Task[];
  onDropTask: (taskId: string, status: TaskStatus) => void;
  onAddClick: (status: TaskStatus) => void;
};

export function BoardColumn({ column, tasks, onDropTask, onAddClick }: Props) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    if (!e.dataTransfer.types.includes(TASK_DRAG_TYPE)) return;
    e.preventDefault(); // drop を許可する
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    // 子要素間の移動で発火する dragleave は無視する
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData(TASK_DRAG_TYPE);
    if (taskId) onDropTask(taskId, column.status);
  };

  const headingId = `column-${column.status}`;

  return (
    <section
      aria-labelledby={headingId}
      data-over={isOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex min-h-80 flex-col rounded-2xl bg-column p-4 transition-shadow data-[over=true]:ring-2 data-[over=true]:ring-foreground/20"
    >
      <header className="flex items-center justify-between px-1">
        <div className="flex items-baseline gap-3">
          <h2 id={headingId} className="font-semibold">
            {column.label}
          </h2>
          <span aria-label={`${tasks.length}件`} className="text-xs text-muted">
            #{tasks.length}
          </span>
        </div>
        {/* 列メニューは未実装のため装飾としてのみ表示 */}
        <MoreIcon className="size-4 text-muted" />
      </header>

      <button
        type="button"
        onClick={() => onAddClick(column.status)}
        aria-label={`${column.label}にタスクを追加`}
        className="mt-3 mb-4 flex items-center gap-2 self-start rounded-md px-1 py-1 text-xs text-muted transition-colors hover:text-foreground"
      >
        <PlusIcon className="size-3.5" />
        タスクを追加
      </button>

      <ul className="flex flex-1 flex-col gap-3">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} />
          </li>
        ))}
      </ul>
    </section>
  );
}

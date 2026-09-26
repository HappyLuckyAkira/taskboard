"use client";

import { useState, type DragEvent } from "react";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import type { Column, Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";

type Props = {
  column: Column;
  tasks: Task[];
  onDropTask: (taskId: string, status: TaskStatus) => void;
};

export function BoardColumn({ column, tasks, onDropTask }: Props) {
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
      className="flex min-h-80 flex-col rounded-xl bg-zinc-100 p-3 transition-colors data-[over=true]:bg-sky-100 data-[over=true]:ring-2 data-[over=true]:ring-sky-400 dark:bg-zinc-900 dark:data-[over=true]:bg-sky-950"
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2
          id={headingId}
          className="font-semibold text-zinc-800 dark:text-zinc-200"
        >
          {column.label}
        </h2>
        <span
          aria-label={`${tasks.length}件`}
          className="rounded-full bg-zinc-200 px-2 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
        >
          {tasks.length}
        </span>
      </header>
      <ul className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} />
          </li>
        ))}
      </ul>
    </section>
  );
}

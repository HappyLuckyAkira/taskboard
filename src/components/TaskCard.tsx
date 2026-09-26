"use client";

import type { DragEvent } from "react";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.setData(TASK_DRAG_TYPE, task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      aria-label={task.title}
      className="cursor-grab rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800"
    >
      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
        {task.title}
      </h3>
      {task.description && (
        <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
          {task.description}
        </p>
      )}
    </article>
  );
}

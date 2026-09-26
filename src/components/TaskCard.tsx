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
      className="cursor-grab rounded-lg bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
      {task.description && (
        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted">
          {task.description}
        </p>
      )}
    </article>
  );
}

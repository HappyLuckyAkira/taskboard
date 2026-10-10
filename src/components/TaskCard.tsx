"use client";

import { useId, type DragEvent } from "react";
import {
  dueSoonLabel,
  formatDueDate,
  isOverdue,
  toDateKey,
} from "@/lib/dueDate";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import { PRIORITIES, type Priority, type Task } from "@/types/task";

type Props = {
  task: Task;
};

const PRIORITY_BADGE: Record<Priority, string> = {
  high: "bg-priority-high-bg text-priority-high",
  medium: "bg-priority-medium-bg text-priority-medium",
  low: "bg-priority-low-bg text-priority-low",
};

export function TaskCard({ task }: Props) {
  const descriptionId = useId();
  const priorityLabel = PRIORITIES.find((p) => p.value === task.priority)?.label;
  const today = toDateKey(new Date());
  const overdue = isOverdue(task.dueDate, today, task.status);
  const dueSoon = dueSoonLabel(task.dueDate, today, task.status);

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    e.dataTransfer.setData(TASK_DRAG_TYPE, task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      aria-label={task.title}
      aria-describedby={task.description ? descriptionId : undefined}
      className="cursor-grab rounded-lg bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
      {task.description && (
        <p
          id={descriptionId}
          className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted"
        >
          {task.description}
        </p>
      )}
      <dl className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
        <div>
          <dt className="sr-only">優先度</dt>
          <dd
            className={`rounded px-1.5 py-0.5 font-medium ${PRIORITY_BADGE[task.priority]}`}
          >
            {priorityLabel}
          </dd>
        </div>
        <div className="flex min-w-0 items-center">
          <dt className="sr-only">担当者</dt>
          <dd className="truncate text-muted">{task.assignee || "未割り当て"}</dd>
        </div>
        {task.dueDate && (
          <div
            className={`ml-auto flex items-center gap-1.5 ${overdue ? "text-danger" : "text-muted"}`}
          >
            <dt className="sr-only">期限</dt>
            <dd>
              <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
            </dd>
            {overdue && <dd className="font-medium">期限切れ</dd>}
            {dueSoon && (
              <dd className="rounded bg-warning-bg px-1.5 py-0.5 font-medium text-warning">
                {dueSoon}
              </dd>
            )}
          </div>
        )}
      </dl>
    </article>
  );
}

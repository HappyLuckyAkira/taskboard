"use client";

import { useEffect } from "react";
import type { NewTaskInput } from "@/types/task";
import { AddTaskForm } from "./AddTaskForm";

type Props = {
  columnLabel: string;
  assigneeOptions: readonly string[];
  onAdd: (input: NewTaskInput) => void;
  onClose: () => void;
};

export function AddTaskDialog({
  columnLabel,
  assigneeOptions,
  onAdd,
  onClose,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={(e) => {
        // 背景のクリックで閉じる（ダイアログ内のクリックは無視）
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl"
      >
        <h2 id="add-task-title" className="text-lg font-semibold">
          新規タスク
        </h2>
        <p className="mt-1 mb-5 text-xs text-muted">
          追加先: {columnLabel}
        </p>
        <AddTaskForm
          assigneeOptions={assigneeOptions}
          onAdd={(input) => {
            onAdd(input);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

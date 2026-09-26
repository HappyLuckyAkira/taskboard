"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onAdd: (title: string, description: string) => void;
  onCancel?: () => void;
};

const fieldClass =
  "rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/40";

export function AddTaskForm({ onAdd, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = title.trim() !== "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">タイトル</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">説明</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </label>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          追加
        </button>
      </div>
    </form>
  );
}

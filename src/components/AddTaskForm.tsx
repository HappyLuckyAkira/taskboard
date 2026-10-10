"use client";

import { useId, useState, type FormEvent } from "react";
import {
  DEFAULT_PRIORITY,
  PRIORITIES,
  type NewTaskInput,
  type Priority,
} from "@/types/task";

type Props = {
  onAdd: (input: NewTaskInput) => void;
  onCancel?: () => void;
  /** 担当者欄の入力候補（既存タスクの担当者） */
  assigneeOptions?: readonly string[];
};

const EMPTY_INPUT: NewTaskInput = {
  title: "",
  description: "",
  assignee: "",
  priority: DEFAULT_PRIORITY,
  dueDate: "",
};

const fieldClass =
  "rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-foreground/40";

export function AddTaskForm({ onAdd, onCancel, assigneeOptions = [] }: Props) {
  const [input, setInput] = useState<NewTaskInput>(EMPTY_INPUT);
  const assigneeListId = useId();

  const canSubmit = input.title.trim() !== "";

  const update = <K extends keyof NewTaskInput>(
    key: K,
    value: NewTaskInput[K],
  ) => setInput((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd(input);
    setInput(EMPTY_INPUT);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">タイトル</span>
        <input
          value={input.title}
          onChange={(e) => update("title", e.target.value)}
          required
          autoFocus
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-muted">説明</span>
        <textarea
          value={input.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">担当者</span>
          <input
            value={input.assignee}
            onChange={(e) => update("assignee", e.target.value)}
            list={assigneeListId}
            autoComplete="off"
            className={fieldClass}
          />
          <datalist id={assigneeListId}>
            {assigneeOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">優先度</span>
          <select
            value={input.priority}
            onChange={(e) => update("priority", e.target.value as Priority)}
            className={fieldClass}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-muted">期限</span>
          <input
            type="date"
            value={input.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>
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

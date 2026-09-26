"use client";

import { useState, type FormEvent } from "react";

type Props = {
  onAdd: (title: string, description: string) => void;
};

export function AddTaskForm({ onAdd }: Props) {
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
    <form
      onSubmit={handleSubmit}
      aria-label="タスクを追加"
      className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-end dark:border-zinc-700 dark:bg-zinc-900"
    >
      <label className="flex flex-1 flex-col gap-1 text-sm">
        <span className="text-zinc-700 dark:text-zinc-300">タイトル</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>
      <label className="flex flex-[2] flex-col gap-1 text-sm">
        <span className="text-zinc-700 dark:text-zinc-300">説明</span>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800"
        />
      </label>
      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        追加
      </button>
    </form>
  );
}

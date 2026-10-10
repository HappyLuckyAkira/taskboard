import type { Task } from "@/types/task";
import { parseTasks, STORAGE_KEY, writeTasks } from "./taskStorage";

/**
 * localStorage を外部ストアとして `useSyncExternalStore` から読むための関数群。
 * サーバーには localStorage が無いので、サーバーとハイドレーション時は「保存データなし」(null) を返す。
 */

const listeners = new Set<() => void>();

// getSnapshot は同じ内容なら同じ参照を返す必要があるので、元の文字列ごとに解析結果を覚えておく
let cachedRaw: string | null = null;
let cachedTasks: Task[] | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** 保存されているタスク一覧。保存データが無ければ null */
export function getStoredTasks(): Task[] | null {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedTasks = raw === null ? null : parseTasks(raw);
  }
  return cachedTasks;
}

export function getServerStoredTasks(): Task[] | null {
  return null;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // 別のタブでの変更は storage イベントで届く（同じタブの変更では発火しない）
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveTasks(tasks: Task[]): void {
  writeTasks(localStorage, tasks);
  // 同じタブの購読者には自分で知らせる
  for (const listener of listeners) listener();
}

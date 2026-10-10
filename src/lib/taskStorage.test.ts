import { describe, expect, it, vi } from "vitest";
import { makeTask } from "@/test/factories";
import { parseTasks, readTasks, STORAGE_KEY, writeTasks } from "./taskStorage";

describe("parseTasks", () => {
  it("保存された JSON をタスク一覧に戻す", () => {
    const tasks = [makeTask({ id: "1", assignee: "佐藤", priority: "high" })];
    expect(parseTasks(JSON.stringify(tasks))).toEqual(tasks);
  });

  it("壊れた JSON や配列でないデータは空配列にする", () => {
    expect(parseTasks("{oops")).toEqual([]);
    expect(parseTasks(JSON.stringify({ id: "1" }))).toEqual([]);
  });

  it("新しい項目が無い古いデータは既定値で補う", () => {
    const old = [{ id: "1", title: "A", description: "d", status: "done" }];
    expect(parseTasks(JSON.stringify(old))).toEqual([
      makeTask({ id: "1", title: "A", description: "d", status: "done" }),
    ]);
  });

  it("必須項目や値が不正な要素は捨てる", () => {
    const data = [
      { id: "1", title: "A", status: "unknown" },
      { title: "id なし", status: "todo" },
      { id: "2", title: "B", status: "todo", priority: "urgent" },
      { id: "3", title: "C", status: "todo", priority: "low" },
    ];
    expect(parseTasks(JSON.stringify(data))).toEqual([
      makeTask({ id: "3", title: "C", priority: "low" }),
    ]);
  });
});

describe("readTasks / writeTasks", () => {
  it("書き込んだタスクを読み出せる", () => {
    const tasks = [makeTask({ id: "1" })];
    writeTasks(localStorage, tasks);
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(tasks));
    expect(readTasks(localStorage)).toEqual(tasks);
  });

  it("保存データが無ければ null を返す", () => {
    expect(readTasks(localStorage)).toBeNull();
  });

  it("ストレージが例外を投げても呼び出し元へ伝えない", () => {
    const broken = {
      getItem: vi.fn(() => {
        throw new Error("denied");
      }),
      setItem: vi.fn(() => {
        throw new Error("quota");
      }),
    };
    expect(readTasks(broken)).toBeNull();
    expect(() => writeTasks(broken, [])).not.toThrow();
  });
});

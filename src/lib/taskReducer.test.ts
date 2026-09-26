import { describe, expect, it } from "vitest";
import type { Task } from "@/types/task";
import { taskReducer, tasksByStatus } from "./taskReducer";

const sample: Task[] = [
  { id: "1", title: "A", description: "", status: "todo" },
  { id: "2", title: "B", description: "", status: "in-progress" },
  { id: "3", title: "C", description: "", status: "todo" },
];

describe("taskReducer", () => {
  describe("add", () => {
    it("未着手としてタスクを末尾に追加する", () => {
      const result = taskReducer([], {
        type: "add",
        id: "x",
        title: "買い物",
        description: "牛乳",
      });
      expect(result).toEqual([
        { id: "x", title: "買い物", description: "牛乳", status: "todo" },
      ]);
    });

    it("タイトルと説明の前後の空白を取り除く", () => {
      const [task] = taskReducer([], {
        type: "add",
        id: "x",
        title: "  買い物 ",
        description: " 牛乳  ",
      });
      expect(task.title).toBe("買い物");
      expect(task.description).toBe("牛乳");
    });

    it("タイトルが空白のみなら追加しない", () => {
      const tasks: Task[] = [];
      const result = taskReducer(tasks, {
        type: "add",
        id: "x",
        title: "   ",
        description: "desc",
      });
      expect(result).toBe(tasks);
    });

    it("元の配列を変更しない", () => {
      const tasks = [...sample];
      taskReducer(tasks, { type: "add", id: "x", title: "T", description: "" });
      expect(tasks).toEqual(sample);
    });
  });

  describe("move", () => {
    it("指定したタスクのステータスを変更する", () => {
      const result = taskReducer(sample, {
        type: "move",
        id: "1",
        status: "done",
      });
      expect(result.find((t) => t.id === "1")?.status).toBe("done");
      expect(result).toHaveLength(3);
    });

    it("移動したタスクは移動先の列の末尾に並ぶ", () => {
      const result = taskReducer(sample, {
        type: "move",
        id: "1",
        status: "in-progress",
      });
      expect(tasksByStatus(result, "in-progress").map((t) => t.id)).toEqual([
        "2",
        "1",
      ]);
    });

    it("同じステータスへの移動では状態を変えない", () => {
      const result = taskReducer(sample, {
        type: "move",
        id: "1",
        status: "todo",
      });
      expect(result).toBe(sample);
    });

    it("存在しない ID は無視する", () => {
      const result = taskReducer(sample, {
        type: "move",
        id: "nope",
        status: "done",
      });
      expect(result).toBe(sample);
    });
  });
});

describe("tasksByStatus", () => {
  it("指定ステータスのタスクだけを順序を保って返す", () => {
    expect(tasksByStatus(sample, "todo").map((t) => t.id)).toEqual(["1", "3"]);
    expect(tasksByStatus(sample, "done")).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { makeTask } from "@/test/factories";
import type { Task } from "@/types/task";
import { taskReducer, tasksByStatus } from "./taskReducer";

const sample: Task[] = [
  makeTask({ id: "1", title: "A", status: "todo" }),
  makeTask({ id: "2", title: "B", status: "in-progress" }),
  makeTask({ id: "3", title: "C", status: "todo" }),
];

describe("taskReducer", () => {
  describe("add", () => {
    it("未着手としてタスクを末尾に追加し、未指定の項目は既定値にする", () => {
      const result = taskReducer([], {
        type: "add",
        id: "x",
        title: "買い物",
        description: "牛乳",
      });
      expect(result).toEqual([
        {
          id: "x",
          title: "買い物",
          description: "牛乳",
          status: "todo",
          assignee: "",
          priority: "medium",
          dueDate: "",
        },
      ]);
    });

    it("担当者・優先度・期限を指定して追加できる", () => {
      const [task] = taskReducer([], {
        type: "add",
        id: "x",
        title: "T",
        description: "",
        assignee: "佐藤",
        priority: "high",
        dueDate: "2026-10-20",
      });
      expect(task).toMatchObject({
        assignee: "佐藤",
        priority: "high",
        dueDate: "2026-10-20",
      });
    });

    it("status を指定するとその列に追加する", () => {
      const [task] = taskReducer([], {
        type: "add",
        id: "x",
        title: "T",
        description: "",
        status: "in-progress",
      });
      expect(task.status).toBe("in-progress");
    });

    it("保留の列に追加できる", () => {
      const [task] = taskReducer([], {
        type: "add",
        id: "x",
        title: "T",
        description: "",
        status: "on-hold",
      });
      expect(task.status).toBe("on-hold");
    });

    it("タイトル・説明・担当者の前後の空白を取り除く", () => {
      const [task] = taskReducer([], {
        type: "add",
        id: "x",
        title: "  買い物 ",
        description: " 牛乳  ",
        assignee: "  佐藤 ",
      });
      expect(task.title).toBe("買い物");
      expect(task.description).toBe("牛乳");
      expect(task.assignee).toBe("佐藤");
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

    it("保留へ移動できる", () => {
      const result = taskReducer(sample, {
        type: "move",
        id: "2",
        status: "on-hold",
      });
      expect(tasksByStatus(result, "on-hold").map((t) => t.id)).toEqual(["2"]);
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

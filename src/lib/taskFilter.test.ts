import { describe, expect, it } from "vitest";
import { makeTask } from "@/test/factories";
import type { Task } from "@/types/task";
import {
  EMPTY_FILTER,
  filterTasks,
  isFiltering,
  listAssignees,
  UNASSIGNED,
} from "./taskFilter";

const tasks: Task[] = [
  makeTask({
    id: "1",
    title: "ログイン画面",
    description: "Validation を追加",
    assignee: "佐藤",
    priority: "high",
  }),
  makeTask({
    id: "2",
    title: "README 更新",
    description: "",
    assignee: "鈴木",
    priority: "low",
  }),
  makeTask({ id: "3", title: "調査", description: "ログを確認", priority: "high" }),
];

const ids = (result: Task[]) => result.map((t) => t.id);

describe("filterTasks", () => {
  it("条件が空なら全件を返す", () => {
    expect(filterTasks(tasks, EMPTY_FILTER)).toBe(tasks);
  });

  it("キーワードでタイトルと説明を部分一致で検索する", () => {
    expect(ids(filterTasks(tasks, { ...EMPTY_FILTER, query: "ログ" }))).toEqual([
      "1",
      "3",
    ]);
  });

  it("検索は大文字小文字と前後の空白を区別しない", () => {
    expect(
      ids(filterTasks(tasks, { ...EMPTY_FILTER, query: "  validation " })),
    ).toEqual(["1"]);
  });

  it("担当者で絞り込む", () => {
    expect(
      ids(filterTasks(tasks, { ...EMPTY_FILTER, assignee: "鈴木" })),
    ).toEqual(["2"]);
  });

  it("未割り当てのタスクだけに絞り込める", () => {
    expect(
      ids(filterTasks(tasks, { ...EMPTY_FILTER, assignee: UNASSIGNED })),
    ).toEqual(["3"]);
  });

  it("優先度で絞り込む", () => {
    expect(
      ids(filterTasks(tasks, { ...EMPTY_FILTER, priority: "high" })),
    ).toEqual(["1", "3"]);
  });

  it("複数の条件はすべて満たすものだけを返す", () => {
    expect(
      ids(
        filterTasks(tasks, { query: "ログ", assignee: "佐藤", priority: "high" }),
      ),
    ).toEqual(["1"]);
  });
});

describe("UNASSIGNED", () => {
  it("サーバーで描画した HTML を経由しても値が変わらない", () => {
    // 制御文字などは HTML の解析時に置き換えられ、選択肢の値が一致しなくなる
    const container = document.createElement("div");
    container.innerHTML = `<select><option value="${UNASSIGNED}"></option></select>`;
    expect(container.querySelector("option")?.value).toBe(UNASSIGNED);
  });
});

describe("isFiltering", () => {
  it("条件が 1 つでも入っていれば true", () => {
    expect(isFiltering(EMPTY_FILTER)).toBe(false);
    expect(isFiltering({ ...EMPTY_FILTER, query: "  " })).toBe(false);
    expect(isFiltering({ ...EMPTY_FILTER, priority: "low" })).toBe(true);
  });
});

describe("listAssignees", () => {
  it("担当者名を重複なしで並べて返す（未割り当ては含めない）", () => {
    const withDup = [...tasks, makeTask({ id: "4", assignee: "佐藤" })];
    expect(listAssignees(withDup)).toEqual(
      ["佐藤", "鈴木"].sort((a, b) => a.localeCompare(b, "ja")),
    );
  });
});

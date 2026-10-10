import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import { createDataTransfer } from "@/test/dataTransfer";
import { makeTask } from "@/test/factories";
import { TaskCard } from "./TaskCard";

const task = makeTask({
  id: "t1",
  title: "設計",
  description: "画面設計を行う",
  assignee: "佐藤",
  priority: "high",
  dueDate: "2026-10-20",
});

const card = (name = "設計") => screen.getByRole("article", { name });

describe("TaskCard", () => {
  beforeEach(() => {
    // Date だけを固定する（フェイクタイマーは使わない）
    vi.setSystemTime(new Date(2026, 9, 10, 12, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("タイトルと説明を表示する", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByRole("heading", { name: "設計" })).toBeInTheDocument();
    expect(card()).toHaveAccessibleDescription("画面設計を行う");
  });

  it("説明が空なら説明欄を描画しない", () => {
    render(<TaskCard task={{ ...task, description: "" }} />);
    expect(card()).toHaveAccessibleDescription("");
  });

  it("優先度・担当者・期限を表示する", () => {
    render(<TaskCard task={task} />);
    const c = within(card());
    expect(c.getByText("高")).toBeInTheDocument();
    expect(c.getByText("佐藤")).toBeInTheDocument();
    expect(c.getByText("10/20")).toBeInTheDocument();
    expect(c.queryByText("期限切れ")).toBeNull();
  });

  it("担当者が空なら「未割り当て」、期限が空なら期限を表示しない", () => {
    render(<TaskCard task={{ ...task, assignee: "", dueDate: "" }} />);
    const c = within(card());
    expect(c.getByText("未割り当て")).toBeInTheDocument();
    expect(c.queryByText("期限")).toBeNull();
  });

  it("期限を過ぎた未完了のタスクは「期限切れ」と表示する", () => {
    render(<TaskCard task={{ ...task, dueDate: "2026-10-09" }} />);
    expect(within(card()).getByText("期限切れ")).toBeInTheDocument();
  });

  it("期限まで 3 日以内なら「期限間近」として残り日数を表示する", () => {
    render(<TaskCard task={{ ...task, dueDate: "2026-10-11" }} />);
    const c = within(card());
    expect(c.getByText("明日まで")).toBeInTheDocument();
    expect(c.queryByText("期限切れ")).toBeNull();
  });

  it("期限まで 4 日以上ある、または期限切れなら「期限間近」は出さない", () => {
    const { unmount } = render(
      <TaskCard task={{ ...task, dueDate: "2026-10-14" }} />,
    );
    expect(within(card()).queryByText(/まで$|^あと\d+日$/)).toBeNull();
    unmount();

    render(<TaskCard task={{ ...task, dueDate: "2026-10-09" }} />);
    expect(within(card()).queryByText(/まで$|^あと\d+日$/)).toBeNull();
  });

  it("完了したタスクは期限を過ぎても「期限切れ」にしない", () => {
    render(
      <TaskCard task={{ ...task, dueDate: "2026-10-09", status: "done" }} />,
    );
    expect(within(card()).queryByText("期限切れ")).toBeNull();
  });

  it("ドラッグ可能で、ドラッグ開始時にタスク ID を渡す", () => {
    render(<TaskCard task={task} />);
    const dataTransfer = createDataTransfer();

    expect(card()).toHaveAttribute("draggable", "true");
    fireEvent.dragStart(card(), { dataTransfer });

    expect(dataTransfer.getData(TASK_DRAG_TYPE)).toBe("t1");
    expect(dataTransfer.effectAllowed).toBe("move");
  });
});

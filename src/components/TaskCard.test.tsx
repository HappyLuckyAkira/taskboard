import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import { createDataTransfer } from "@/test/dataTransfer";
import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";

const task: Task = {
  id: "t1",
  title: "設計",
  description: "画面設計を行う",
  status: "todo",
};

describe("TaskCard", () => {
  it("タイトルと説明を表示する", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByRole("heading", { name: "設計" })).toBeInTheDocument();
    expect(screen.getByText("画面設計を行う")).toBeInTheDocument();
  });

  it("説明が空なら説明欄を描画しない", () => {
    const { container } = render(
      <TaskCard task={{ ...task, description: "" }} />,
    );
    expect(container.querySelector("p")).toBeNull();
  });

  it("ドラッグ可能で、ドラッグ開始時にタスク ID を渡す", () => {
    render(<TaskCard task={task} />);
    const card = screen.getByRole("article", { name: "設計" });
    const dataTransfer = createDataTransfer();

    expect(card).toHaveAttribute("draggable", "true");
    fireEvent.dragStart(card, { dataTransfer });

    expect(dataTransfer.getData(TASK_DRAG_TYPE)).toBe("t1");
    expect(dataTransfer.effectAllowed).toBe("move");
  });
});

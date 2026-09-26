import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TASK_DRAG_TYPE } from "@/lib/dragData";
import { createDataTransfer } from "@/test/dataTransfer";
import type { Column, Task } from "@/types/task";
import { BoardColumn } from "./BoardColumn";

const column: Column = { status: "in-progress", label: "進行中" };
const tasks: Task[] = [
  { id: "a", title: "A", description: "", status: "in-progress" },
  { id: "b", title: "B", description: "", status: "in-progress" },
];

describe("BoardColumn", () => {
  it("列名・件数・タスクを表示する", () => {
    render(<BoardColumn column={column} tasks={tasks} onDropTask={vi.fn()} onAddClick={vi.fn()} />);
    const region = screen.getByRole("region", { name: "進行中" });

    expect(within(region).getByLabelText("2件")).toHaveTextContent("#2");
    expect(within(region).getAllByRole("article")).toHaveLength(2);
  });

  it("「タスクを追加」で列のステータスを渡して onAddClick を呼ぶ", async () => {
    const onAddClick = vi.fn();
    render(
      <BoardColumn
        column={column}
        tasks={[]}
        onDropTask={vi.fn()}
        onAddClick={onAddClick}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "進行中にタスクを追加" }),
    );
    expect(onAddClick).toHaveBeenCalledExactlyOnceWith("in-progress");
  });

  it("タスクがドロップされると列のステータスで onDropTask を呼ぶ", () => {
    const onDropTask = vi.fn();
    render(<BoardColumn column={column} tasks={[]} onDropTask={onDropTask} onAddClick={vi.fn()} />);
    const region = screen.getByRole("region", { name: "進行中" });
    const dataTransfer = createDataTransfer();
    dataTransfer.setData(TASK_DRAG_TYPE, "x");

    fireEvent.dragOver(region, { dataTransfer });
    expect(region).toHaveAttribute("data-over", "true");

    fireEvent.drop(region, { dataTransfer });
    expect(onDropTask).toHaveBeenCalledExactlyOnceWith("x", "in-progress");
    expect(region).toHaveAttribute("data-over", "false");
  });

  it("タスク以外のドラッグはハイライトしない", () => {
    const onDropTask = vi.fn();
    render(<BoardColumn column={column} tasks={[]} onDropTask={onDropTask} onAddClick={vi.fn()} />);
    const region = screen.getByRole("region", { name: "進行中" });
    const dataTransfer = createDataTransfer();
    dataTransfer.setData("text/plain", "hello");

    fireEvent.dragOver(region, { dataTransfer });
    expect(region).toHaveAttribute("data-over", "false");

    fireEvent.drop(region, { dataTransfer });
    expect(onDropTask).not.toHaveBeenCalled();
  });

  it("列の外へ出るとハイライトを解除する", () => {
    render(<BoardColumn column={column} tasks={[]} onDropTask={vi.fn()} onAddClick={vi.fn()} />);
    const region = screen.getByRole("region", { name: "進行中" });
    const dataTransfer = createDataTransfer();
    dataTransfer.setData(TASK_DRAG_TYPE, "x");

    fireEvent.dragOver(region, { dataTransfer });
    fireEvent.dragLeave(region, { relatedTarget: document.body });

    expect(region).toHaveAttribute("data-over", "false");
  });
});

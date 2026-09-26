import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createDataTransfer } from "@/test/dataTransfer";
import type { Task } from "@/types/task";
import { TaskBoard } from "./TaskBoard";

const column = (name: string) => screen.getByRole("region", { name });

describe("TaskBoard", () => {
  it("未着手・進行中・完了の3列を表示する", () => {
    render(<TaskBoard />);
    for (const name of ["未着手", "進行中", "完了"]) {
      expect(column(name)).toBeInTheDocument();
    }
  });

  it("追加したタスクは未着手列に表示される", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.type(screen.getByLabelText("タイトル"), "新しいタスク");
    await user.type(screen.getByLabelText("説明"), "詳細");
    await user.click(screen.getByRole("button", { name: "追加" }));

    const todo = column("未着手");
    expect(
      within(todo).getByRole("article", { name: "新しいタスク" }),
    ).toHaveTextContent("詳細");
  });

  it("ドラッグ＆ドロップでタスクを別の列へ移動できる", () => {
    const initialTasks: Task[] = [
      { id: "1", title: "移動するタスク", description: "", status: "todo" },
    ];
    render(<TaskBoard initialTasks={initialTasks} />);

    const card = within(column("未着手")).getByRole("article", {
      name: "移動するタスク",
    });
    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(column("完了"), { dataTransfer });
    fireEvent.drop(column("完了"), { dataTransfer });

    expect(within(column("未着手")).queryAllByRole("article")).toHaveLength(0);
    expect(
      within(column("完了")).getByRole("article", { name: "移動するタスク" }),
    ).toBeInTheDocument();
  });
});

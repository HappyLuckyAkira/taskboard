import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createDataTransfer } from "@/test/dataTransfer";
import type { Task } from "@/types/task";
import { TaskBoard } from "./TaskBoard";

const column = (name: string) => screen.getByRole("region", { name });

describe("TaskBoard", () => {
  it("未着手・進行中・完了の3列と「カラムを追加」枠を表示する", () => {
    render(<TaskBoard />);
    for (const name of ["未着手", "進行中", "完了"]) {
      expect(column(name)).toBeInTheDocument();
    }
    expect(screen.getByText("カラムを追加")).toBeInTheDocument();
  });

  it("ヘッダーにタスクの総数を表示する", () => {
    const initialTasks: Task[] = [
      { id: "1", title: "A", description: "", status: "todo" },
      { id: "2", title: "B", description: "", status: "done" },
    ];
    render(<TaskBoard initialTasks={initialTasks} />);
    expect(screen.getByText("2件のタスク")).toBeInTheDocument();
  });

  it("「新規タスク」から追加したタスクは未着手列に表示される", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(screen.getByRole("button", { name: "新規タスク" }));
    const dialog = screen.getByRole("dialog", { name: "新規タスク" });
    await user.type(within(dialog).getByLabelText("タイトル"), "新しいタスク");
    await user.type(within(dialog).getByLabelText("説明"), "詳細");
    await user.click(within(dialog).getByRole("button", { name: "追加" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      within(column("未着手")).getByRole("article", { name: "新しいタスク" }),
    ).toHaveTextContent("詳細");
    expect(screen.getByText("1件のタスク")).toBeInTheDocument();
  });

  it("列の「タスクを追加」から追加したタスクはその列に表示される", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(
      screen.getByRole("button", { name: "完了にタスクを追加" }),
    );
    expect(screen.getByText("追加先: 完了")).toBeInTheDocument();
    await user.type(screen.getByLabelText("タイトル"), "済んだ作業{Enter}");

    expect(
      within(column("完了")).getByRole("article", { name: "済んだ作業" }),
    ).toBeInTheDocument();
  });

  it("キャンセル・Escape でダイアログを閉じ、タスクは追加しない", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(screen.getByRole("button", { name: "新規タスク" }));
    await user.type(screen.getByLabelText("タイトル"), "やめる");
    await user.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "新規タスク" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();

    expect(screen.queryAllByRole("article")).toHaveLength(0);
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

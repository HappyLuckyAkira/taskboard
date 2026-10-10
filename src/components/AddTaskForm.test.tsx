import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddTaskForm } from "./AddTaskForm";

describe("AddTaskForm", () => {
  it("入力した内容で onAdd を呼び、フォームをクリアする", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTaskForm onAdd={onAdd} />);

    const title = screen.getByLabelText("タイトル");
    const description = screen.getByLabelText("説明");
    const assignee = screen.getByLabelText("担当者");
    const priority = screen.getByLabelText("優先度");
    const dueDate = screen.getByLabelText("期限");
    await user.type(title, "レビュー");
    await user.type(description, "PR #12 を確認");
    await user.type(assignee, "佐藤");
    await user.selectOptions(priority, "高");
    await user.type(dueDate, "2026-10-20");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(onAdd).toHaveBeenCalledExactlyOnceWith({
      title: "レビュー",
      description: "PR #12 を確認",
      assignee: "佐藤",
      priority: "high",
      dueDate: "2026-10-20",
    });
    expect(title).toHaveValue("");
    expect(description).toHaveValue("");
    expect(assignee).toHaveValue("");
    expect(priority).toHaveValue("medium");
    expect(dueDate).toHaveValue("");
  });

  it("優先度の初期値は「中」で、担当者・期限は空のまま追加できる", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTaskForm onAdd={onAdd} />);

    expect(screen.getByLabelText("優先度")).toHaveDisplayValue("中");
    await user.type(screen.getByLabelText("タイトル"), "タスク{Enter}");

    expect(onAdd).toHaveBeenCalledExactlyOnceWith({
      title: "タスク",
      description: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
    });
  });

  it("既存の担当者を入力候補として出す", () => {
    render(<AddTaskForm onAdd={vi.fn()} assigneeOptions={["佐藤", "鈴木"]} />);
    const options = screen.getAllByRole("option", { hidden: true });
    expect(options.map((o) => o.getAttribute("value"))).toEqual(
      expect.arrayContaining(["佐藤", "鈴木"]),
    );
  });

  it("タイトルが空の間は追加ボタンが無効", async () => {
    const user = userEvent.setup();
    render(<AddTaskForm onAdd={vi.fn()} />);
    const button = screen.getByRole("button", { name: "追加" });

    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("タイトル"), "   ");
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("タイトル"), "x");
    expect(button).toBeEnabled();
  });

  it("onCancel を渡すとキャンセルボタンを表示し、押すと呼ばれる", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { rerender } = render(<AddTaskForm onAdd={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "キャンセル" })).toBeNull();

    rerender(<AddTaskForm onAdd={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: "キャンセル" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});

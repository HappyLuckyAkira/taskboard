import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddTaskForm } from "./AddTaskForm";

describe("AddTaskForm", () => {
  it("入力したタイトルと説明で onAdd を呼び、フォームをクリアする", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTaskForm onAdd={onAdd} />);

    const title = screen.getByLabelText("タイトル");
    const description = screen.getByLabelText("説明");
    await user.type(title, "レビュー");
    await user.type(description, "PR #12 を確認");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(onAdd).toHaveBeenCalledExactlyOnceWith("レビュー", "PR #12 を確認");
    expect(title).toHaveValue("");
    expect(description).toHaveValue("");
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

  it("タイトル欄で Enter キーを押しても送信できる", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddTaskForm onAdd={onAdd} />);

    await user.type(screen.getByLabelText("タイトル"), "タスク{Enter}");

    expect(onAdd).toHaveBeenCalledExactlyOnceWith("タスク", "");
  });
});

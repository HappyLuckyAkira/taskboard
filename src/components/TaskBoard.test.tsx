import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { STORAGE_KEY } from "@/lib/taskStorage";
import { createDataTransfer } from "@/test/dataTransfer";
import { makeTask } from "@/test/factories";
import type { Task } from "@/types/task";
import { TaskBoard } from "./TaskBoard";

const column = (name: string) => screen.getByRole("region", { name });
const cardTitles = () =>
  screen.queryAllByRole("article").map((a) => a.getAttribute("aria-label"));

describe("TaskBoard", () => {
  it("未着手・進行中・保留・完了の4列をこの順に表示し、「カラムを追加」枠も表示する", () => {
    render(<TaskBoard />);
    const names = screen
      .getAllByRole("region")
      .map((region) => within(region).getByRole("heading").textContent);
    expect(names).toEqual(["未着手", "進行中", "保留", "完了"]);
    expect(screen.getByText("カラムを追加")).toBeInTheDocument();
  });

  it("ヘッダーにタスクの総数を表示する", () => {
    const initialTasks: Task[] = [
      makeTask({ id: "1", status: "todo" }),
      makeTask({ id: "2", status: "done" }),
    ];
    render(<TaskBoard initialTasks={initialTasks} />);
    expect(screen.getByText("2件のタスク")).toBeInTheDocument();
  });

  it("「新規タスク」から担当者・優先度・期限付きで追加したタスクは未着手列に表示される", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(screen.getByRole("button", { name: "新規タスク" }));
    const dialog = within(screen.getByRole("dialog", { name: "新規タスク" }));
    await user.type(dialog.getByLabelText("タイトル"), "新しいタスク");
    await user.type(dialog.getByLabelText("説明"), "詳細");
    await user.type(dialog.getByLabelText("担当者"), "佐藤");
    await user.selectOptions(dialog.getByLabelText("優先度"), "高");
    await user.type(dialog.getByLabelText("期限"), "2099-12-31");
    await user.click(dialog.getByRole("button", { name: "追加" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    const card = within(column("未着手")).getByRole("article", {
      name: "新しいタスク",
    });
    expect(card).toHaveAccessibleDescription("詳細");
    expect(within(card).getByText("佐藤")).toBeInTheDocument();
    expect(within(card).getByText("高")).toBeInTheDocument();
    expect(within(card).getByText("12/31")).toBeInTheDocument();
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
      makeTask({ id: "1", title: "移動するタスク", status: "todo" }),
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

  it("ドラッグ＆ドロップでタスクを保留列へ移動できる", () => {
    const initialTasks: Task[] = [
      makeTask({ id: "1", title: "止めるタスク", status: "in-progress" }),
    ];
    render(<TaskBoard initialTasks={initialTasks} />);

    const card = within(column("進行中")).getByRole("article", {
      name: "止めるタスク",
    });
    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.dragOver(column("保留"), { dataTransfer });
    fireEvent.drop(column("保留"), { dataTransfer });

    expect(within(column("進行中")).queryAllByRole("article")).toHaveLength(0);
    expect(
      within(column("保留")).getByRole("article", { name: "止めるタスク" }),
    ).toBeInTheDocument();
  });

  describe("検索・フィルター", () => {
    const initialTasks: Task[] = [
      makeTask({
        id: "1",
        title: "ログイン画面",
        assignee: "佐藤",
        priority: "high",
      }),
      makeTask({
        id: "2",
        title: "README",
        description: "ログの説明を追記",
        assignee: "鈴木",
        priority: "low",
        status: "done",
      }),
      makeTask({ id: "3", title: "調査", priority: "high", status: "on-hold" }),
    ];

    it("キーワードでタイトルと説明を検索し、件数表示と列の件数が変わる", async () => {
      const user = userEvent.setup();
      render(<TaskBoard initialTasks={initialTasks} />);

      await user.type(screen.getByRole("searchbox", { name: "検索" }), "ログ");

      expect(cardTitles()).toEqual(["ログイン画面", "README"]);
      expect(screen.getByText("3件中2件を表示")).toBeInTheDocument();
      expect(within(column("保留")).getByLabelText("0件")).toBeInTheDocument();
    });

    it("担当者と優先度で絞り込み、「条件をクリア」で元に戻る", async () => {
      const user = userEvent.setup();
      render(<TaskBoard initialTasks={initialTasks} />);

      await user.selectOptions(
        screen.getByRole("combobox", { name: "優先度" }),
        "高",
      );
      expect(cardTitles()).toEqual(["ログイン画面", "調査"]);

      await user.selectOptions(
        screen.getByRole("combobox", { name: "担当者" }),
        "未割り当て",
      );
      expect(cardTitles()).toEqual(["調査"]);

      await user.click(screen.getByRole("button", { name: "条件をクリア" }));
      expect(cardTitles()).toHaveLength(3);
      expect(screen.getByText("3件のタスク")).toBeInTheDocument();
    });
  });

  describe("localStorage への保存", () => {
    it("追加・移動したタスクは、ボードを作り直しても残る", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<TaskBoard />);

      await user.click(screen.getByRole("button", { name: "新規タスク" }));
      const dialog = within(screen.getByRole("dialog", { name: "新規タスク" }));
      await user.type(dialog.getByLabelText("タイトル"), "残るタスク");
      await user.type(dialog.getByLabelText("担当者"), "佐藤");
      await user.click(dialog.getByRole("button", { name: "追加" }));
      const dataTransfer = createDataTransfer();
      fireEvent.dragStart(
        within(column("未着手")).getByRole("article", { name: "残るタスク" }),
        { dataTransfer },
      );
      fireEvent.dragOver(column("進行中"), { dataTransfer });
      fireEvent.drop(column("進行中"), { dataTransfer });
      unmount();

      render(<TaskBoard />);
      const card = within(column("進行中")).getByRole("article", {
        name: "残るタスク",
      });
      expect(within(card).getByText("佐藤")).toBeInTheDocument();
    });

    it("保存データがあれば initialTasks より優先して表示する", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([makeTask({ id: "s", title: "保存済み" })]),
      );
      render(
        <TaskBoard initialTasks={[makeTask({ id: "i", title: "初期値" })]} />,
      );
      expect(cardTitles()).toEqual(["保存済み"]);
    });
  });
});

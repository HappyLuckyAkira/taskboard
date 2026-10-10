import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_FILTER, UNASSIGNED } from "@/lib/taskFilter";
import { TaskFilters } from "./TaskFilters";

const setup = (filter = EMPTY_FILTER) => {
  const onChange = vi.fn();
  render(
    <TaskFilters
      filter={filter}
      assigneeOptions={["佐藤", "鈴木"]}
      onChange={onChange}
    />,
  );
  return { user: userEvent.setup(), onChange };
};

describe("TaskFilters", () => {
  it("検索欄に入力すると query を変えて onChange を呼ぶ", async () => {
    const { user, onChange } = setup();
    await user.type(screen.getByRole("searchbox", { name: "検索" }), "a");
    expect(onChange).toHaveBeenLastCalledWith({ ...EMPTY_FILTER, query: "a" });
  });

  it("担当者の選択肢に「すべて」「未割り当て」と担当者名を出し、選ぶと onChange を呼ぶ", async () => {
    const { user, onChange } = setup();
    const select = screen.getByRole("combobox", { name: "担当者" });
    expect(
      within(select)
        .getAllByRole("option")
        .map((o) => o.textContent),
    ).toEqual(["すべて", "未割り当て", "佐藤", "鈴木"]);

    await user.selectOptions(select, "未割り当て");
    expect(onChange).toHaveBeenLastCalledWith({
      ...EMPTY_FILTER,
      assignee: UNASSIGNED,
    });
  });

  it("優先度を選ぶと onChange を呼ぶ", async () => {
    const { user, onChange } = setup();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "優先度" }),
      "高",
    );
    expect(onChange).toHaveBeenLastCalledWith({
      ...EMPTY_FILTER,
      priority: "high",
    });
  });

  it("絞り込み中だけ「条件をクリア」を出し、押すと条件を空にする", async () => {
    const { user, onChange } = setup({ ...EMPTY_FILTER, priority: "low" });
    await user.click(screen.getByRole("button", { name: "条件をクリア" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(EMPTY_FILTER);
  });

  it("条件が空なら「条件をクリア」を出さない", () => {
    setup();
    expect(screen.queryByRole("button", { name: "条件をクリア" })).toBeNull();
  });
});

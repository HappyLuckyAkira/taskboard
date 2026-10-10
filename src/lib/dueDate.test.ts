import { describe, expect, it } from "vitest";
import { formatDueDate, isOverdue, toDateKey } from "./dueDate";

const today = "2026-10-10";

describe("isOverdue", () => {
  it("期限が今日より前なら期限切れ", () => {
    expect(isOverdue("2026-10-09", today, "todo")).toBe(true);
  });

  it("期限が今日または未来なら期限切れではない", () => {
    expect(isOverdue("2026-10-10", today, "todo")).toBe(false);
    expect(isOverdue("2026-10-11", today, "in-progress")).toBe(false);
  });

  it("期限なし・完了済みは期限切れにしない", () => {
    expect(isOverdue("", today, "todo")).toBe(false);
    expect(isOverdue("2026-01-01", today, "done")).toBe(false);
  });
});

describe("formatDueDate", () => {
  it("月/日 の形にする", () => {
    expect(formatDueDate("2026-03-05")).toBe("3/5");
  });
});

describe("toDateKey", () => {
  it("ローカル日付を YYYY-MM-DD にする", () => {
    expect(toDateKey(new Date(2026, 0, 2, 23, 59))).toBe("2026-01-02");
  });
});

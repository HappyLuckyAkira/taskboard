import { describe, expect, it } from "vitest";
import {
  daysUntil,
  dueSoonLabel,
  formatDueDate,
  isOverdue,
  toDateKey,
} from "./dueDate";

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

describe("daysUntil", () => {
  it("今日から期限までの日数を返す（過ぎていれば負）", () => {
    expect(daysUntil("2026-10-10", today)).toBe(0);
    expect(daysUntil("2026-10-13", today)).toBe(3);
    expect(daysUntil("2026-10-09", today)).toBe(-1);
  });

  it("月や年をまたいでも暦の日数で数える", () => {
    expect(daysUntil("2026-11-01", "2026-10-31")).toBe(1);
    expect(daysUntil("2027-01-02", "2026-12-30")).toBe(3);
  });
});

describe("dueSoonLabel", () => {
  it("期限の 3 日前から残り日数を表示する", () => {
    expect(dueSoonLabel("2026-10-10", today, "todo")).toBe("今日まで");
    expect(dueSoonLabel("2026-10-11", today, "todo")).toBe("明日まで");
    expect(dueSoonLabel("2026-10-12", today, "in-progress")).toBe("あと2日");
    expect(dueSoonLabel("2026-10-13", today, "on-hold")).toBe("あと3日");
  });

  it("4 日以上先・期限切れ・期限なし・完了済みは表示しない", () => {
    expect(dueSoonLabel("2026-10-14", today, "todo")).toBeNull();
    expect(dueSoonLabel("2026-10-09", today, "todo")).toBeNull();
    expect(dueSoonLabel("", today, "todo")).toBeNull();
    expect(dueSoonLabel("2026-10-11", today, "done")).toBeNull();
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

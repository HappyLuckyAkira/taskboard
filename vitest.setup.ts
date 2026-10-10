import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
  // タスクは localStorage に保存されるので、テスト間で持ち越さない
  localStorage.clear();
});

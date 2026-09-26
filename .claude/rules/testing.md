---
paths:
  - "src/**/*.test.ts"
  - "src/**/*.test.tsx"
  - "src/test/**"
  - "vitest.config.mts"
  - "vitest.setup.ts"
---

# テストのルール（Vitest + Testing Library）

## 配置と実行

- テストは対象ファイルと同じディレクトリに `<対象>.test.ts(x)` で置く。`vitest.config.mts` は `src/**/*.test.{ts,tsx}` しか拾わない。
- テスト用のヘルパーは `src/test/` に置く。
- 変更したら該当ファイルだけ先に実行する: `npx vitest run src/components/BoardColumn.test.tsx`。最後に `npm test` で全体を確認する。

## 書き方

- `describe` / `it` / `expect` / `vi` は毎回 `vitest` から明示的に import する（グローバルは無効）。
- `cleanup` と jest-dom のマッチャー（`toBeInTheDocument` など）は `vitest.setup.ts` で設定済み。テストファイルで再設定しない。
- テスト名は日本語で、期待する振る舞いを書く（例: `「タスクを追加」で列のステータスを渡して onAddClick を呼ぶ`）。
- フィクスチャは型付きのリテラル（`const tasks: Task[] = [...]`）でテスト内かファイル先頭に書く。
- 追加操作そのものを検証するテスト以外では、UI からタスクを追加せず `<TaskBoard initialTasks={...} />` で初期状態を渡す。

## 要素の取得

- role とアクセシブルネームで取得する。実装の DOM 構造やクラス名には依存しない。
  - 列: `getByRole("region", { name: "保留" })`
  - カード: `getByRole("article", { name: <タイトル> })`
  - 列の追加ボタン: `getByRole("button", { name: "<列名>にタスクを追加" })`
  - ダイアログ: `getByRole("dialog", { name: "新規タスク" })`
  - 件数バッジ: `getByLabelText("2件")`
- 特定の列の中を調べるときは `within(列)` で範囲を絞る。
- 存在しないことの確認は `queryBy*` / `queryAllBy*` を使う。

## 操作

- クリックや入力は `userEvent.setup()` で作った `user` を使い、`await` する。
- ドラッグ＆ドロップだけは `fireEvent` を使う（user-event は HTML5 DnD を扱えない）。jsdom には `DataTransfer` がないので、`src/test/dataTransfer.ts` の `createDataTransfer()` で作った**同じインスタンス**を `dragStart` → `dragOver` → `drop` に渡す。

## 検証

- コールバックは `vi.fn()` で作り、`toHaveBeenCalledExactlyOnceWith(...)` で引数と回数をまとめて確認する。
- reducer のテストでは、状態が変わらないケースで `toBe` を使い、同じ参照が返ることを確認する。元の配列が変更されていないことも確認する。
- 列の並び順のように順序に意味があるものは、配列にして `toEqual` で順序ごと比較する。

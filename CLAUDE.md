# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 概要

TaskBoard — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 の小さなカンバン式タスク管理アプリ。コードはすべて `src/` 配下。UI 文言は日本語。

## コマンド

```bash
npm run dev          # 開発サーバー（Turbopack, http://localhost:3000）
npm run build        # 本番ビルド（Turbopack を明示指定）
npm run lint         # ESLint
npx tsc --noEmit     # 型チェック
npm test             # Vitest を 1 回実行
npm run test:watch   # Vitest ウォッチモード
npx vitest run src/lib/taskReducer.test.ts   # 単一ファイル
npx vitest run -t "保留"                      # テスト名で絞り込み
```

## アーキテクチャ

- **列は `COLUMNS` が唯一の定義元**（`src/types/task.ts`）。列の描画・ドロップ先・列ごとの「タスクを追加」はすべてこの配列から生成される。列を増やすときは `TaskStatus` と `COLUMNS` に追加するだけでよく、あとは `TaskBoard.tsx` のグリッド列数（`xl:grid-cols-*`、列数＋「カラムを追加」枠 1 つ）を合わせる。
- **タスクは担当者・優先度（高/中/低）・期限を持つ**（`Task` 型）。属性は追加ダイアログで設定するだけで、編集機能はない。
- **状態遷移は純粋関数の reducer**（`src/lib/taskReducer.ts`、アクションは `add` / `move`）。`crypto.randomUUID()` で ID を振る。
- **タスクは localStorage に保存する**（キー `taskboard:tasks:v1`）。`useTasks` は `useReducer` ではなく `useSyncExternalStore` で `src/lib/taskStore.ts` の localStorage ストアを読み、変更は reducer で次の状態を作って保存する。サーバーとハイドレーション時は「保存データなし」として描画するので不一致は起きない。保存データが無いあいだは `initialTasks` を表示する。読み込み時の検証と古いデータの補完は `src/lib/taskStorage.ts` の `parseTasks`。
- **検索・フィルターは表示だけを絞る**（`src/lib/taskFilter.ts` の純粋関数）。条件は `TaskBoard` の state で、保存データには影響しない。担当者の「未割り当て」は `UNASSIGNED`。`<option value>` としてサーバー描画の HTML を通るので、制御文字などの特殊な値にしない。
- **ドラッグ＆ドロップはライブラリなしの HTML5 DnD**。`TaskCard` が `dataTransfer` に独自 MIME タイプ（`src/lib/dragData.ts` の `TASK_DRAG_TYPE`）でタスク ID を載せ、`BoardColumn` がその型のときだけ drop を受け付ける。
- **タスク追加はダイアログ**。`TaskBoard` の `addingTo`（追加先ステータス、`null` で閉）が開閉と追加先を兼ねる。ヘッダーの「新規タスク」は未着手へ、列の「タスクを追加」はその列へ追加する。
- ヘッダーの「…」メニューと右端の「カラムを追加」は**見た目のみで未実装**。
- **色はテーマトークン**。`src/app/globals.css` の CSS 変数（`--column`, `--card`, `--muted`, `--primary` など）を `@theme inline` で Tailwind カラー（`bg-column`, `text-muted` など）として公開し、ダークモードは `prefers-color-scheme` で切り替え。色の直書きではなくこれらのトークンを使う。

## テスト

- Vitest + jsdom + Testing Library。テストは対象と同じ場所に `*.test.ts(x)` で置く（`vitest.config.mts` は `src/**/*.test.{ts,tsx}` のみ対象）。パスエイリアス `@/*` は Vite の `resolve.tsconfigPaths` で解決。
- jsdom は `DataTransfer` を持たないため、DnD のテストは `src/test/dataTransfer.ts` の `createDataTransfer()` を同じインスタンスで `dragStart` → `dragOver` → `drop` に渡す。
- 要素は role とアクセシブルネームで取得する（列は `region`＋列名、カードは `article`＋タイトル、列の追加ボタンは「<列名>にタスクを追加」）。フィルター欄と追加ダイアログに同じラベル（担当者・優先度）があるので、ダイアログ内は `within(getByRole("dialog"))` で絞る。
- テスト用のタスクは `src/test/factories.ts` の `makeTask()` で作る。`vitest.setup.ts` が各テスト後に `localStorage.clear()` する。
- 日付を固定するときはフェイクタイマーを使わず `vi.setSystemTime()` だけにし、`afterEach` で `vi.useRealTimers()` を呼ぶ（`userEvent` と干渉しない）。

## 注意点

- Vitest 5 が `@types/node` 22 以上を要求するため `@types/node` は `^22`。
- Windows 環境で、ファイルをエディタ以外（シェル等）で書き換えると開発サーバーが新しい Tailwind クラスの CSS を再生成しないことがある。見た目が反映されないときは開発サーバーを再起動する。
- リポジトリは public（GitHub: HappyLuckyAkira/taskboard）。コミットの作成者メールは GitHub の noreply アドレスを使う。

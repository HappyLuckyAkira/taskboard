---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript / React のルール

## 型

- `tsconfig.json` は `strict: true`。`any` や非 null アサーション（`!`）で型エラーを黙らせない。
- 型は `interface` ではなく `type` で定義する。
- 型だけの import は `import type { Task } from "@/types/task"`、値と混在する場合は `import { COLUMNS, type Task } from "@/types/task"` のようにインラインの `type` 指定子を使う。
- ステータスのような取りうる値が決まっているものは文字列リテラルのユニオン型にする（`TaskStatus`）。`switch` はユニオンを網羅し、`default` を置かずに型チェックで漏れを検出させる。
- ドメインの型と定数は `src/types/` に置く。

## モジュールと import

- ディレクトリをまたぐ import はパスエイリアス `@/`（例: `@/lib/taskReducer`）、同じディレクトリ内は相対パス `./`。
- コンポーネントは名前付きエクスポート（`export function TaskCard`）。デフォルトエクスポートは Next.js が要求する `src/app/` の `page.tsx` / `layout.tsx` だけ。

## コンポーネント

- 1 ファイル 1 コンポーネント、責務ごとに分割する。
- Props はファイル内で `type Props = { ... }` と定義し、関数の引数で分割代入する。
- フックやイベントハンドラを使うコンポーネントは先頭に `"use client"`。`src/app/page.tsx` はサーバーコンポーネントのままにし、クライアントの状態は `TaskBoard` 以下に閉じ込める。
- イベントの型は `import type { DragEvent, FormEvent } from "react"` で React のものを使う。
- 子へ渡すコールバックで依存が安定しているものは `useCallback` で包む（`useTasks` を参照）。
- アイコンは `src/components/icons.tsx` のインライン SVG に追加する。アイコンライブラリは入れない。
- 操作できない装飾要素には `aria-hidden` を付け、ボタンやフォームを見た目だけで置かない。

## 状態ロジック

- 状態遷移は `src/lib/` の純粋関数（reducer）に置き、コンポーネントには書かない。
- 引数の配列やオブジェクトを変更せず、新しい値を返す。何も変わらない場合（空タイトルの追加、同じ列への移動など）は**受け取った参照をそのまま返す**。テストは `toBe` で参照の同一性を確認している。

## スタイル

- Tailwind のユーティリティクラスで書く。色は `globals.css` のテーマトークン（`bg-column`, `bg-card`, `text-muted`, `bg-primary`, `text-primary-foreground`, `border-border` など）を使い、`zinc-*` や 16 進数を直接書かない。新しい色が必要ならライト・ダーク両方の CSS 変数を追加して `@theme inline` で公開する。
- 状態による見た目の切り替えは `data-*` 属性と `data-[over=true]:` のようなバリアントで行う（`BoardColumn` を参照）。

## コメント

- コメントは日本語で、コードから読み取れない「なぜ」だけを書く。

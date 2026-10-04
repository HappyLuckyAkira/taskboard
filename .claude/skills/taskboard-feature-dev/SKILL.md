---
name: taskboard-feature-dev
description: TaskBoard に新しい機能をTDDで追加するとき使用する。失敗するテストを先に書き、状態管理を整え、UI更新し、最後にブラウザで動作を確認するまで一貫した手順で進める。
---

TaskBoard に機能を追加するときは、以下の順で進めてください。

1. 追加する機能のユーザー操作（誰が・どこで・何をすると・どうなるか）を確認する
2. 失敗するテストを先に追加し、`npx vitest run <テストファイル>` で失敗することを確かめる
   - 状態遷移は `src/lib/taskReducer.test.ts`、画面の操作は `src/components/*.test.tsx`
3. 状態遷移は `src/lib/taskReducer.ts` の reducer にアクションとして追加し、`src/hooks/useTasks.ts` から関数として公開する
4. 既存コンポーネントの責務分担を変えずに UI を更新する
5. `npm test` と `npm run build` で検証する
6. 必要に応じて、開発サーバー（`npm run dev`）を起動し、Playwright MCP で http://localhost:3000 の画面操作を確認する

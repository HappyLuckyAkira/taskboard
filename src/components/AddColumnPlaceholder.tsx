import { PlusIcon } from "./icons";

/**
 * 「カラムを追加」の枠。見た目のみで、カラム追加の動作はまだ実装していない。
 */
export function AddColumnPlaceholder() {
  return (
    <div
      aria-hidden
      className="flex min-h-80 flex-col items-center justify-center gap-1 rounded-2xl bg-column/70 text-muted"
    >
      <PlusIcon className="size-5" />
      <span className="text-xs">カラムを追加</span>
    </div>
  );
}

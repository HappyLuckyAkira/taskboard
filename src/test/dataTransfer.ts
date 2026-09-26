/**
 * jsdom は DataTransfer を実装していないため、DnD テスト用の最小限のモック。
 * 同じインスタンスを dragStart → dragOver → drop に渡してデータを受け渡す。
 */
export function createDataTransfer() {
  const store = new Map<string, string>();
  return {
    dropEffect: "none",
    effectAllowed: "all",
    get types() {
      return Array.from(store.keys());
    },
    setData(format: string, data: string) {
      store.set(format, data);
    },
    getData(format: string) {
      return store.get(format) ?? "";
    },
    clearData() {
      store.clear();
    },
  };
}

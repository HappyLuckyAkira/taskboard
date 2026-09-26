import { TaskBoard } from "@/components/TaskBoard";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">TaskBoard</h1>
      <TaskBoard />
    </main>
  );
}

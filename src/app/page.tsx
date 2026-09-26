import { TaskBoard } from "@/components/TaskBoard";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 py-10 sm:px-12">
      <TaskBoard />
    </main>
  );
}

"use client";

import { useTasks } from "@/hooks/useTasks";
import { tasksByStatus } from "@/lib/taskReducer";
import { COLUMNS, type Task } from "@/types/task";
import { AddTaskForm } from "./AddTaskForm";
import { BoardColumn } from "./BoardColumn";

type Props = {
  initialTasks?: Task[];
};

export function TaskBoard({ initialTasks }: Props) {
  const { tasks, addTask, moveTask } = useTasks(initialTasks);

  return (
    <div className="flex flex-col gap-6">
      <AddTaskForm onAdd={addTask} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <BoardColumn
            key={column.status}
            column={column}
            tasks={tasksByStatus(tasks, column.status)}
            onDropTask={moveTask}
          />
        ))}
      </div>
    </div>
  );
}

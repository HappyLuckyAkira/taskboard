"use client";

import { useCallback, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { tasksByStatus } from "@/lib/taskReducer";
import { COLUMNS, type Task, type TaskStatus } from "@/types/task";
import { AddColumnPlaceholder } from "./AddColumnPlaceholder";
import { AddTaskDialog } from "./AddTaskDialog";
import { BoardColumn } from "./BoardColumn";
import { BoardHeader } from "./BoardHeader";

type Props = {
  initialTasks?: Task[];
};

export function TaskBoard({ initialTasks }: Props) {
  const { tasks, addTask, moveTask } = useTasks(initialTasks);
  // ダイアログの追加先の列。null のときダイアログは閉じている
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const closeDialog = useCallback(() => setAddingTo(null), []);

  const addingColumn = COLUMNS.find((c) => c.status === addingTo);

  return (
    <div className="flex flex-1 flex-col gap-10">
      <BoardHeader
        taskCount={tasks.length}
        onNewTask={() => setAddingTo("todo")}
      />
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((column) => (
          <BoardColumn
            key={column.status}
            column={column}
            tasks={tasksByStatus(tasks, column.status)}
            onDropTask={moveTask}
            onAddClick={setAddingTo}
          />
        ))}
        <AddColumnPlaceholder />
      </div>
      {addingColumn && (
        <AddTaskDialog
          columnLabel={addingColumn.label}
          onAdd={(title, description) =>
            addTask(title, description, addingColumn.status)
          }
          onClose={closeDialog}
        />
      )}
    </div>
  );
}

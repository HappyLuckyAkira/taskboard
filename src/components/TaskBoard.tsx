"use client";

import { useCallback, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import {
  EMPTY_FILTER,
  filterTasks,
  isFiltering,
  listAssignees,
  type TaskFilter,
} from "@/lib/taskFilter";
import { tasksByStatus } from "@/lib/taskReducer";
import { COLUMNS, type Task, type TaskStatus } from "@/types/task";
import { AddColumnPlaceholder } from "./AddColumnPlaceholder";
import { AddTaskDialog } from "./AddTaskDialog";
import { BoardColumn } from "./BoardColumn";
import { BoardHeader } from "./BoardHeader";
import { TaskFilters } from "./TaskFilters";

type Props = {
  /** 保存データが無いときに表示するタスク */
  initialTasks?: Task[];
};

export function TaskBoard({ initialTasks }: Props) {
  const { tasks, addTask, moveTask } = useTasks(initialTasks);
  // ダイアログの追加先の列。null のときダイアログは閉じている
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);
  const [filter, setFilter] = useState<TaskFilter>(EMPTY_FILTER);
  const closeDialog = useCallback(() => setAddingTo(null), []);

  const addingColumn = COLUMNS.find((c) => c.status === addingTo);
  const assignees = listAssignees(tasks);
  const visibleTasks = filterTasks(tasks, filter);

  return (
    <div className="flex flex-1 flex-col gap-8">
      <BoardHeader
        taskCount={tasks.length}
        visibleCount={isFiltering(filter) ? visibleTasks.length : undefined}
        onNewTask={() => setAddingTo("todo")}
      />
      <TaskFilters
        filter={filter}
        assigneeOptions={assignees}
        onChange={setFilter}
      />
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {COLUMNS.map((column) => (
          <BoardColumn
            key={column.status}
            column={column}
            tasks={tasksByStatus(visibleTasks, column.status)}
            onDropTask={moveTask}
            onAddClick={setAddingTo}
          />
        ))}
        <AddColumnPlaceholder />
      </div>
      {addingColumn && (
        <AddTaskDialog
          columnLabel={addingColumn.label}
          assigneeOptions={assignees}
          onAdd={(input) => addTask(input, addingColumn.status)}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}

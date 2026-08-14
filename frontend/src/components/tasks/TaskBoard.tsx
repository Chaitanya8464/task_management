import TaskColumn from "./TaskColumn";
import { Task } from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskBoard({
  tasks,
  onEdit,
  onDelete,
}: TaskBoardProps) {
  const todo = tasks.filter(
    (task) => task.status === "To Do",
  );

  const doing = tasks.filter(
    (task) => task.status === "Doing",
  );

  const completed = tasks.filter(
    (task) => task.status === "Completed",
  );

  const onHold = tasks.filter(
    (task) => task.status === "On Hold",
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <TaskColumn
        title="To Do"
        tasks={todo}
        color="bg-zinc-400"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <TaskColumn
        title="Doing"
        tasks={doing}
        color="bg-blue-500"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <TaskColumn
        title="Completed"
        tasks={completed}
        color="bg-emerald-500"
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <TaskColumn
        title="On Hold"
        tasks={onHold}
        color="bg-orange-500"
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
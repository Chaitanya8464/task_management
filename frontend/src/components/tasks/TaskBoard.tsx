import TaskColumn from "./TaskColumn";
import { Task } from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];
}

export default function TaskBoard({ tasks }: TaskBoardProps) {
  const todo = tasks.filter((task) => task.status === "To Do");
  const doing = tasks.filter((task) => task.status === "Doing");
  const completed = tasks.filter(
    (task) => task.status === "Completed",
  );
  const onHold = tasks.filter((task) => task.status === "On Hold");

  return (
    <div className="flex gap-5 overflow-x-auto pb-6">
      <TaskColumn
        title="To Do"
        tasks={todo}
        color="bg-zinc-400"
      />

      <TaskColumn
        title="Doing"
        tasks={doing}
        color="bg-blue-500"
      />

      <TaskColumn
        title="Completed"
        tasks={completed}
        color="bg-emerald-500"
      />

      <TaskColumn
        title="On Hold"
        tasks={onHold}
        color="bg-orange-500"
      />
    </div>
  );
}
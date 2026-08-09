import TaskColumn from "./TaskColumn";
import { Task } from "./TaskCard";

const tasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage",
    description: "Create the initial homepage design and layout.",
    priority: "High",
    status: "To Do",
    assignee: "John",
    dueDate: "Sep 12",
    comments: 3,
  },
  {
    id: "2",
    title: "Write API Documentation",
    description: "Create clear and detailed API documentation.",
    priority: "Medium",
    status: "To Do",
    assignee: "Sarah",
    dueDate: "Sep 14",
    comments: 2,
  },
  {
    id: "3",
    title: "Implement Search Function",
    description: "Add search functionality to the application.",
    priority: "High",
    status: "To Do",
    assignee: "Mike",
    dueDate: "Sep 15",
    comments: 5,
  },
  {
    id: "4",
    title: "Develop Login",
    description: "Implement authentication and login flow.",
    priority: "Urgent",
    status: "Doing",
    assignee: "Alex",
    dueDate: "Sep 16",
    comments: 4,
  },
  {
    id: "5",
    title: "Deploy to Production",
    description: "Prepare the application for production deployment.",
    priority: "Medium",
    status: "Doing",
    assignee: "David",
    dueDate: "Sep 18",
    comments: 1,
  },
  {
    id: "6",
    title: "Code Review Completed",
    priority: "Low",
    status: "Completed",
    assignee: "Sarah",
    dueDate: "Sep 10",
    comments: 2,
  },
  {
    id: "7",
    title: "UI Design Updated",
    priority: "Medium",
    status: "Completed",
    assignee: "John",
    dueDate: "Sep 11",
    comments: 3,
  },
  {
    id: "8",
    title: "Security Audit Scheduled",
    priority: "High",
    status: "On Hold",
    assignee: "Mike",
    dueDate: "Sep 20",
    comments: 1,
  },
];

export default function TaskBoard() {
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
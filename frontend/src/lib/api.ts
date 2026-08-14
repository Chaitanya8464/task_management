const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Request failed: ${response.status}`,
    );
  }

  return response.json();
}

export interface ApiTask {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "DOING" | "COMPLETED" | "ON_HOLD";
  priority:
    | "URGENT"
    | "HIGH"
    | "MEDIUM"
    | "LOW"
    | "NO_PRIORITY";
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  assigneeId?: string | null;
  creatorId?: string | null;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  subtasks: unknown[];
  comments: unknown[];
  labels: unknown[];
}

export interface GuestLoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  workspace: {
    id: string;
    name: string;
    ownerId: string;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?:
    | "URGENT"
    | "HIGH"
    | "MEDIUM"
    | "LOW"
    | "NO_PRIORITY";
  status?: "TODO" | "DOING" | "COMPLETED" | "ON_HOLD";
  dueDate?: string;
  workspaceId: string;
  assigneeId?: string;
  creatorId?: string;
}

export async function guestLogin() {
  return request<GuestLoginResponse>("/auth/guest", {
    method: "POST",
  });
}

export async function getTasks() {
  return request<ApiTask[]>("/tasks");
}

export async function getTask(id: string) {
  return request<ApiTask>(`/tasks/${id}`);
}

export async function createTask(
  task: CreateTaskInput,
) {
  return request<ApiTask>("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTask(
  id: string,
  task: Partial<CreateTaskInput>,
) {
  return request<ApiTask>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(task),
  });
}

export async function deleteTask(id: string) {
  return request<{ message: string }>(
    `/tasks/${id}`,
    {
      method: "DELETE",
    },
  );
}
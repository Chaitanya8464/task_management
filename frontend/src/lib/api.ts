const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

// =====================================================
// Base API Request
// =====================================================

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
      errorText ||
        `Request failed: ${response.status}`,
    );
  }

  return response.json();
}

// =====================================================
// Comment Types
// =====================================================

export interface ApiComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: string;
  userId: string;

  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface CreateCommentInput {
  content: string;
  userId: string;
}

// =====================================================
// Subtask Types
// =====================================================

export interface ApiSubtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  taskId: string;
}

export interface CreateSubtaskInput {
  title: string;
}

export interface UpdateSubtaskInput {
  title?: string;
  completed?: boolean;
}

// =====================================================
// Label Types
// =====================================================

export interface ApiLabel {
  id: string;
  name: string;
  color: string;
}

// =====================================================
// Task Types
// =====================================================

export interface ApiTask {
  id: string;
  title: string;
  description?: string | null;

  status:
    | "TODO"
    | "DOING"
    | "COMPLETED"
    | "ON_HOLD";

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

  subtasks: ApiSubtask[];

  comments: ApiComment[];

  labels: ApiLabel[];
}

export type ApiTaskDetails = ApiTask;

// =====================================================
// Workspace Types
// =====================================================

export interface WorkspaceMember {
  id: string;

  role:
    | "OWNER"
    | "ADMIN"
    | "MEMBER";

  joinedAt: string;

  workspaceId: string;
  userId: string;

  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

// =====================================================
// Authentication Types
// =====================================================

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

// =====================================================
// Task Input
// =====================================================

export interface CreateTaskInput {
  title: string;

  description?: string;

  priority?:
    | "URGENT"
    | "HIGH"
    | "MEDIUM"
    | "LOW"
    | "NO_PRIORITY";

  status?:
    | "TODO"
    | "DOING"
    | "COMPLETED"
    | "ON_HOLD";

  dueDate?: string;

  workspaceId: string;

  assigneeId?: string;
  creatorId?: string;
}

// =====================================================
// Authentication API
// =====================================================

export async function guestLogin() {
  return request<GuestLoginResponse>(
    "/auth/guest",
    {
      method: "POST",
    },
  );
}

// =====================================================
// Task API
// =====================================================

export async function getTasks() {
  return request<ApiTask[]>("/tasks");
}

export async function getTask(
  id: string,
) {
  return request<ApiTask>(
    `/tasks/${id}`,
  );
}

export async function getTaskDetails(
  id: string,
) {
  return request<ApiTaskDetails>(
    `/tasks/${id}`,
  );
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
  return request<ApiTask>(
    `/tasks/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(task),
    },
  );
}

export async function deleteTask(
  id: string,
) {
  return request<{ message: string }>(
    `/tasks/${id}`,
    {
      method: "DELETE",
    },
  );
}

// =====================================================
// Subtask API
// =====================================================

export async function createSubtask(
  taskId: string,
  subtask: CreateSubtaskInput,
) {
  return request<ApiSubtask>(
    `/tasks/${taskId}/subtasks`,
    {
      method: "POST",
      body: JSON.stringify(subtask),
    },
  );
}

export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  subtask: UpdateSubtaskInput,
) {
  return request<ApiSubtask>(
    `/tasks/${taskId}/subtasks/${subtaskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(subtask),
    },
  );
}

export async function deleteSubtask(
  taskId: string,
  subtaskId: string,
) {
  return request<{ message: string }>(
    `/tasks/${taskId}/subtasks/${subtaskId}`,
    {
      method: "DELETE",
    },
  );
}

// =====================================================
// Comment API
// =====================================================

export async function createComment(
  taskId: string,
  comment: CreateCommentInput,
) {
  return request<ApiComment>(
    `/tasks/${taskId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(comment),
    },
  );
}

// =====================================================
// Workspace API
// =====================================================

export async function getWorkspaceMembers(
  workspaceId: string,
) {
  return request<WorkspaceMember[]>(
    `/workspaces/${workspaceId}/members`,
  );
}
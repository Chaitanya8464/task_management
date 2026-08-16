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
    const errorText =
      await response.text();

    throw new Error(
      errorText ||
        `Request failed: ${response.status}`,
    );
  }

  return response.json();
}

// =====================================================
// User
// =====================================================

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

// =====================================================
// Task Status & Priority
// =====================================================

export type TaskStatus =
  | "TODO"
  | "DOING"
  | "COMPLETED"
  | "ON_HOLD";

export type TaskPriority =
  | "URGENT"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NO_PRIORITY";

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

  user?: ApiUser;
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

  priority: TaskPriority;

  dueDate?: string | null;

  assigneeId?: string | null;
  assignee?: ApiUser | null;

  createdAt: string;
  updatedAt: string;

  taskId: string;
}

export interface CreateSubtaskInput {
  title: string;

  priority?: TaskPriority;

  dueDate?: string;

  assigneeId?: string;
}

export interface UpdateSubtaskInput {
  title?: string;

  completed?: boolean;

  priority?: TaskPriority;

  dueDate?: string;

  assigneeId?: string | null;
}

// =====================================================
// Label Types
// =====================================================

export interface ApiLabel {
  id: string;
  name: string;
  color: string;
}

export interface CreateLabelInput {
  name: string;
  color: string;
}

export interface AssignLabelInput {
  labelId: string;
}

// =====================================================
// Task Types
// =====================================================

export interface ApiTask {
  id: string;

  title: string;

  description?: string | null;

  status: TaskStatus;

  priority: TaskPriority;

  dueDate?: string | null;

  createdAt: string;

  updatedAt: string;

  workspaceId: string;

  // Project relationship
  projectId?: string | null;

  assigneeId?: string | null;

  creatorId?: string | null;

  assignee?: ApiUser | null;

  creator?: ApiUser | null;

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

  user: ApiUser;
}

// =====================================================
// Project Types
// =====================================================

export interface ApiProject {
  id: string;

  name: string;

  description?: string | null;

  priority: TaskPriority;

  dueDate?: string | null;

  createdAt: string;

  updatedAt: string;

  workspaceId: string;

  leadId?: string | null;

  lead?: ApiUser | null;

  tasks?: ApiTask[];

  _count?: {
    tasks: number;
  };
}

export interface CreateProjectInput {
  name: string;

  description?: string;

  priority?: TaskPriority;

  dueDate?: string;

  workspaceId: string;

  leadId?: string;
}

export interface UpdateProjectInput {
  name?: string;

  description?: string | null;

  priority?: TaskPriority;

  dueDate?: string | null;

  leadId?: string | null;
}

// =====================================================
// Authentication Types
// =====================================================

export interface GuestLoginResponse {
  message: string;

  user: ApiUser;

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

  priority?: TaskPriority;

  status?: TaskStatus;

  dueDate?: string;

  workspaceId: string;

  // Optional project relationship
  projectId?: string;

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
  return request<ApiTask[]>(
    "/tasks",
  );
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
  return request<ApiTask>(
    "/tasks",
    {
      method: "POST",
      body: JSON.stringify(task),
    },
  );
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
  return request<{
    message: string;
  }>(
    `/tasks/${id}`,
    {
      method: "DELETE",
    },
  );
}

// =====================================================
// Project API
// =====================================================

export async function getProjects(
  workspaceId?: string,
) {
  const query = workspaceId
    ? `?workspaceId=${encodeURIComponent(
        workspaceId,
      )}`
    : "";

  return request<ApiProject[]>(
    `/projects${query}`,
  );
}

export async function getProject(
  id: string,
) {
  return request<ApiProject>(
    `/projects/${id}`,
  );
}

export async function createProject(
  project: CreateProjectInput,
) {
  return request<ApiProject>(
    "/projects",
    {
      method: "POST",
      body: JSON.stringify(project),
    },
  );
}

export async function updateProject(
  id: string,
  project: UpdateProjectInput,
) {
  return request<ApiProject>(
    `/projects/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(project),
    },
  );
}

export async function deleteProject(
  id: string,
) {
  return request<{
    message: string;
    id: string;
  }>(
    `/projects/${id}`,
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
  return request<{
    message: string;
  }>(
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
// Label API
// =====================================================

export async function createLabel(
  workspaceId: string,
  label: CreateLabelInput,
) {
  return request<ApiLabel>(
    `/tasks/workspace/${workspaceId}/labels`,
    {
      method: "POST",
      body: JSON.stringify(label),
    },
  );
}

export async function getWorkspaceLabels(
  workspaceId: string,
) {
  return request<ApiLabel[]>(
    `/tasks/workspace/${workspaceId}/labels`,
  );
}

export async function assignLabel(
  taskId: string,
  labelId: string,
) {
  return request<ApiTask>(
    `/tasks/${taskId}/labels`,
    {
      method: "POST",
      body: JSON.stringify({
        labelId,
      }),
    },
  );
}

export async function removeLabel(
  taskId: string,
  labelId: string,
) {
  return request<ApiTask>(
    `/tasks/${taskId}/labels/${labelId}`,
    {
      method: "DELETE",
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
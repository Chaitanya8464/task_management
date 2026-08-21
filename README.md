# TaskFlow

A full-stack task and project management application built with Next.js, React, TypeScript, Tailwind CSS, NestJS, Prisma, and PostgreSQL.

## 📸 Screenshots

Add your screenshots under `docs/screenshots/` and replace the filenames if needed.

### Login Dashboard
![Login Dashboard](./docs/screenshots/login.png)

**Reference:** Main task-management screen showing tasks, status, priority, assignee, due date, projects, and actions.

### Task Details
![Task Details](./docs/screenshots/tasksdetails.png)

**Reference:** Task details screen showing properties, labels, resources, subtasks, comments, and updates.

### Create Subtask
![Create Subtask](./docs/screenshots/create_subtasks.png)

**Reference:** Subtask creation form with title, priority, assignee, and due date.

**Reference:** Subtask editing interface.

### Projects
![Projects](./docs/screenshots/projects.png)

**Reference:** Projects and project-related information.

### Project Details
![Project Details](./docs/screenshots/project_delatis.png)

**Reference:** Label creation, assignment, and display.

### Task In List
![Task In List View](./docs/screenshots/task_in_list.png)

### Profile Details
![Profile Details](./docs/screenshots/profile_details.png)

### Theme
![Theme Color](./docs/screenshots/coolor_mode.png)


> Add the actual screenshots to `docs/screenshots/` before submitting.

---

## ✨ Features

### Tasks
- Create, update, and delete tasks
- Status and priority management
- Due dates
- Task assignees and creators
- Project association

### Subtasks
- Create, edit, and delete subtasks
- Completion state
- Priority
- Assignee
- Due date
- Persistent updates through the API

### Projects
- Create, edit, and delete projects
- Project priority and due date
- Project lead
- Task/project relationship

### Labels
- Create workspace labels
- Custom label colors
- Assign/remove labels from tasks
- Workspace-level unique label names

### Comments
- Add comments to tasks
- Display author and timestamps

### Workspace
- Workspace members
- Owner/Admin/Member roles
- Workspace-specific tasks, projects, and labels

### Authentication
- Guest authentication
- Google authentication

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | React framework and routing |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive design |
| Lucide React | Icons |
| Fetch API | REST API communication |

## Backend

| Technology | Purpose |
|---|---|
| NestJS | Backend/API framework |
| TypeScript | Backend development |
| Prisma | ORM/database access |
| PostgreSQL | Relational database |
| class-validator | DTO/request validation |
| REST API | Frontend/backend communication |

## Development

- Node.js
- npm
- Git
- GitHub
- VS Code
- Prisma CLI

---

# 🏗️ Project Structure

```text
TaskFlow/
│
├── frontend/
│   ├── app/
│   │   ├── tasks/
│   │   ├── projects/
│   │   └── ...
│   ├── components/
│   │   ├── layout/
│   │   ├── tasks/
│   │   └── projects/
│   ├── lib/
│   │   └── api.ts
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/
│   │   ├── projects/
│   │   │   ├── dto/
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.module.ts
│   │   │   └── projects.service.ts
│   │   ├── tasks/
│   │   │   ├── dto/
│   │   │   │   ├── assign-label.dto.ts
│   │   │   │   ├── create-comment.dto.ts
│   │   │   │   ├── create-label.dto.ts
│   │   │   │   ├── create-subtask.dto.ts
│   │   │   │   ├── create-task.dto.ts
│   │   │   │   ├── update-subtask.dto.ts
│   │   │   │   └── update-task.dto.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.module.ts
│   │   │   └── tasks.service.ts
│   │   ├── workspaces/
│   │   ├── prisma.service.ts
│   │   ├── app.controller.ts
│   │   └── app.module.ts
│   ├── package.json
│   └── ...
│
├── docs/
│   └── screenshots/
│
└── README.md
```

> Adjust frontend folder names if your actual repository uses a different structure.

---

# 🔄 Architecture

```text
┌────────────────────────┐
│      Next.js UI        │
│ React + TypeScript     │
└───────────┬────────────┘
            │ HTTP / JSON
            ▼
┌────────────────────────┐
│       NestJS API       │
│ Controllers + Services │
└───────────┬────────────┘
            │ Prisma
            ▼
┌────────────────────────┐
│       PostgreSQL       │
└────────────────────────┘
```

The frontend API layer is centralized in:

```text
frontend/lib/api.ts
```

This keeps API communication separate from UI components.

---

# 🗄️ Database

Main Prisma models:

```text
User
Workspace
WorkspaceMember
Project
Task
Subtask
Comment
Label
```

Relationships include:

```text
Workspace
 ├── Members
 ├── Projects
 ├── Tasks
 └── Labels

Task
 ├── Project
 ├── Subtasks
 ├── Comments
 └── Labels

User
 ├── Assigned Tasks
 ├── Created Tasks
 ├── Assigned Subtasks
 └── Comments
```

### Enums

```text
TaskStatus
├── TODO
├── DOING
├── COMPLETED
└── ON_HOLD

TaskPriority
├── URGENT
├── HIGH
├── MEDIUM
├── LOW
└── NO_PRIORITY

WorkspaceRole
├── OWNER
├── ADMIN
└── MEMBER
```

---

# 🚀 How to Run Locally

## Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- Git

Check:

```bash
node --version
npm --version
git --version
```

## 1. Clone

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd TaskFlow
```

Replace the placeholder with your actual GitHub URL.

---

# ⚙️ Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Never commit `.env` or API secrets.

Generate Prisma Client:

```bash
npx prisma generate
```

Apply the database schema using the command appropriate to your repository:

```bash
npx prisma migrate dev
```

or:

```bash
npx prisma db push
```

Start the backend:

```bash
npm run start:dev
```

Default backend URL:

```text
http://localhost:3001
```

---

# 💻 Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start:

```bash
npm run dev
```

Default frontend URL:

```text
http://localhost:3000
```

---

# 🔌 API Endpoints

## Tasks

```text
GET     /tasks
GET     /tasks/:id
POST    /tasks
PATCH   /tasks/:id
DELETE  /tasks/:id
```

## Subtasks

```text
POST    /tasks/:taskId/subtasks
PATCH   /tasks/:taskId/subtasks/:subtaskId
DELETE  /tasks/:taskId/subtasks/:subtaskId
```

## Comments

```text
POST    /tasks/:taskId/comments
```

## Labels

```text
POST    /tasks/workspace/:workspaceId/labels
GET     /tasks/workspace/:workspaceId/labels
POST    /tasks/:taskId/labels
DELETE  /tasks/:taskId/labels/:labelId
```

## Projects

```text
GET     /projects
GET     /projects/:id
POST    /projects
PATCH   /projects/:id
DELETE  /projects/:id
```

## Workspace

```text
GET     /workspaces/:workspaceId/members
```

---

# 🧩 Reusable Components

The UI uses reusable components for repeated patterns, including:

```text
AddTaskodel
TaskCard
TaskBord
TaskFilter
TaskList
Subtask
AppShell
CustomDropdown
DropdownTitle
SectionHeading
DetailButton
DetailRow
PriorityIcon
Avatar
```

This keeps common UI behavior out of individual pages and improves maintainability.

---

# 📱 Responsive Design

The application is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive techniques include:

- Flexible layouts
- Responsive grids
- Wide-table handling
- Mobile-friendly controls
- Adaptive spacing and typography
- Dark/light styling where implemented

---

# 🧪 Pre-Submission Checklist

### Tasks
- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Change status
- [ ] Change priority
- [ ] Assign member
- [ ] Set due date

### Subtasks
- [ ] Create subtask
- [ ] Set priority while creating
- [ ] Assign member while creating
- [ ] Set due date while creating
- [ ] Edit priority
- [ ] Edit assignee
- [ ] Edit due date
- [ ] Toggle completion
- [ ] Delete subtask
- [ ] Refresh and verify persistence

### Labels
- [ ] Create label
- [ ] Display newly created label
- [ ] Assign label
- [ ] Remove label

### Projects
- [ ] Create project
- [ ] Edit project
- [ ] Delete project
- [ ] Assign project lead
- [ ] Set project priority

### General
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Responsive layout
- [ ] API errors handled
- [ ] No secrets committed

---

# 🌐 Deployment

Update the frontend environment variable with the deployed backend:

```env
NEXT_PUBLIC_API_URL=https://<YOUR-BACKEND-URL>
```

Example final URLs:

```text
Frontend:
https://task-management-tau-rust.vercel.app/

Backend:
https://task-management-1-yicj.onrender.com
```

Make sure the frontend can communicate with the deployed backend and that the live URL works independently of your local machine.

The assessment requires the deployment to remain accessible for at least **45 days** after submission.

---

# 📚 Screenshot Folder

Recommended structure:

```text
docs/
└── screenshots/
    ├── 
    ├── 
    ├── 
    ├── 
    ├── 

Add images with:

```markdown
![Tasks Login](./docs/screenshots/login.png)
![Tasks](./docs/screenshots/task.png)
![Tasks In List VIew](./docs/screenshots/task_in_list.png)
![Add Tasks](./docs/screenshots/add_task.png)
![Tasks Details](./docs/screenshots/tasksdetails.png)
![Projects ](./docs/screenshots/projects.png)
![Project_details](./docs/screenshots/project_delatis.png)
![Profile_Details](./docs/screenshots/profile_details.png)
![Theme And Color](./docs/screenshots/coolor_mode.png)
![Sign Out](./docs/screenshots/sign_out.png)
```

---

# 📝 Git Commit Strategy

The assessment requests multiple small, meaningful commits.

Examples:

```text
feat: add task dashboard
feat: add task details page
feat: add task CRUD APIs
feat: add project management
feat: add subtask management
feat: add subtask priority and assignment
feat: add workspace labels
feat: add task comments
fix: persist subtask priority and assignee
fix: refresh labels after creation
refactor: extract reusable dropdown component
refactor: improve API service layer
style: improve responsive task layout
docs: add project README
```

Avoid a single large commit such as:

```text
final project
```

---

# 🎯 Assessment Focus

The project is structured around the assessment's key areas:

- Attention to detail
- Frontend skills
- Backend skills
- Component reusability
- Architecture
- Code quality
- Responsiveness
- Product thinking
- Communication
- Maintainability

---

# 👨‍💻 Author

**Chaitanya Verma**

Full Stack Developer

---

## License

This project was created for assessment/evaluation purposes.

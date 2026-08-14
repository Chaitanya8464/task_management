import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma.service.js";

import { CreateTaskDto } from "./dto/create-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";

import { CreateSubtaskDto } from "./dto/create-subtask.dto.js";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto.js";

import { CreateCommentDto } from "./dto/create-comment.dto.js";

import { CreateLabelDto } from "./dto/create-label.dto.js";
import { AssignLabelDto } from "./dto/assign-label.dto.js";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ==========================================
  // TASKS
  // ==========================================

  async create(
    createTaskDto: CreateTaskDto,
  ) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,

        description:
          createTaskDto.description,

        status:
          createTaskDto.status,

        priority:
          createTaskDto.priority,

        dueDate:
          createTaskDto.dueDate
            ? new Date(
                createTaskDto.dueDate,
              )
            : undefined,

        workspaceId:
          createTaskDto.workspaceId,

        assigneeId:
          createTaskDto.assigneeId,

        creatorId:
          createTaskDto.creatorId,
      },

      include: {
        assignee: true,
        creator: true,
        subtasks: true,
        comments: true,
        labels: true,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        assignee: true,
        creator: true,
        subtasks: true,
        comments: true,
        labels: true,
      },
    });
  }

  async findOne(
    id: string,
  ) {
    const task =
      await this.prisma.task.findUnique({
        where: {
          id,
        },

        include: {
          assignee: true,

          creator: true,

          subtasks: {
            orderBy: {
              createdAt: "asc",
            },
          },

          comments: {
            include: {
              user: true,
            },

            orderBy: {
              createdAt: "asc",
            },
          },

          labels: true,
        },
      });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: {
        id,
      },

      data: {
        title:
          updateTaskDto.title,

        description:
          updateTaskDto.description,

        status:
          updateTaskDto.status,

        priority:
          updateTaskDto.priority,

        dueDate:
          updateTaskDto.dueDate
            ? new Date(
                updateTaskDto.dueDate,
              )
            : undefined,

        assigneeId:
          updateTaskDto.assigneeId,
      },

      include: {
        assignee: true,
        creator: true,
        subtasks: true,
        comments: true,
        labels: true,
      },
    });
  }

  async remove(
    id: string,
  ) {
    await this.findOne(id);

    await this.prisma.task.delete({
      where: {
        id,
      },
    });

    return {
      message:
        "Task deleted successfully",
    };
  }

  // ==========================================
  // SUBTASKS
  // ==========================================

  async createSubtask(
    taskId: string,
    createSubtaskDto: CreateSubtaskDto,
  ) {
    // Check parent task
    await this.findOne(taskId);

    return this.prisma.subtask.create({
      data: {
        title:
          createSubtaskDto.title,

        taskId,
      },
    });
  }

  async updateSubtask(
    taskId: string,
    subtaskId: string,
    updateSubtaskDto: UpdateSubtaskDto,
  ) {
    const subtask =
      await this.prisma.subtask.findFirst({
        where: {
          id: subtaskId,
          taskId,
        },
      });

    if (!subtask) {
      throw new NotFoundException(
        "Subtask not found",
      );
    }

    return this.prisma.subtask.update({
      where: {
        id: subtaskId,
      },

      data: {
        title:
          updateSubtaskDto.title,

        completed:
          updateSubtaskDto.completed,
      },
    });
  }

  async removeSubtask(
    taskId: string,
    subtaskId: string,
  ) {
    const subtask =
      await this.prisma.subtask.findFirst({
        where: {
          id: subtaskId,
          taskId,
        },
      });

    if (!subtask) {
      throw new NotFoundException(
        "Subtask not found",
      );
    }

    await this.prisma.subtask.delete({
      where: {
        id: subtaskId,
      },
    });

    return {
      message:
        "Subtask deleted successfully",
    };
  }

  // ==========================================
  // COMMENTS
  // ==========================================

  async createComment(
    taskId: string,
    createCommentDto: CreateCommentDto,
  ) {
    // Check parent task
    await this.findOne(taskId);

    // Check user
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: createCommentDto.userId,
        },
      });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createCommentDto.userId} not found`,
      );
    }

    return this.prisma.comment.create({
      data: {
        content:
          createCommentDto.content.trim(),

        taskId,

        userId:
          createCommentDto.userId,
      },

      include: {
        user: true,
      },
    });
  }

  // ==========================================
  // LABELS
  // ==========================================

  async createLabel(
    workspaceId: string,
    createLabelDto: CreateLabelDto,
  ) {
    // Check workspace
    const workspace =
      await this.prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found`,
      );
    }

    const labelName =
      createLabelDto.name.trim();

    // Because Prisma schema has:
    // @@unique([workspaceId, name])
    const existingLabel =
      await this.prisma.label.findUnique({
        where: {
          workspaceId_name: {
            workspaceId,
            name: labelName,
          },
        },
      });

    if (existingLabel) {
      throw new BadRequestException(
        "A label with this name already exists in this workspace",
      );
    }

    return this.prisma.label.create({
      data: {
        name: labelName,
        color: createLabelDto.color,
        workspaceId,
      },
    });
  }

  async getWorkspaceLabels(
    workspaceId: string,
  ) {
    // Check workspace
    const workspace =
      await this.prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found`,
      );
    }

    return this.prisma.label.findMany({
      where: {
        workspaceId,
      },

      orderBy: {
        name: "asc",
      },
    });
  }

  async assignLabel(
    taskId: string,
    assignLabelDto: AssignLabelDto,
  ) {
    // Find task
    const task =
      await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
      });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found`,
      );
    }

    // Find label
    const label =
      await this.prisma.label.findUnique({
        where: {
          id: assignLabelDto.labelId,
        },
      });

    if (!label) {
      throw new NotFoundException(
        `Label with ID ${assignLabelDto.labelId} not found`,
      );
    }

    // Prevent assigning a label from
    // another workspace
    if (
      label.workspaceId !==
      task.workspaceId
    ) {
      throw new BadRequestException(
        "Label does not belong to the task workspace",
      );
    }

    // Connect label to task
    return this.prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        labels: {
          connect: {
            id: label.id,
          },
        },
      },

      include: {
        assignee: true,
        creator: true,
        subtasks: true,
        comments: {
          include: {
            user: true,
          },
        },
        labels: true,
      },
    });
  }

  async removeLabel(
    taskId: string,
    labelId: string,
  ) {
    // Find task and current labels
    const task =
      await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },

        include: {
          labels: true,
        },
      });

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${taskId} not found`,
      );
    }

    // Make sure label is actually
    // attached to this task
    const labelAttached =
      task.labels.some(
        (label) =>
          label.id === labelId,
      );

    if (!labelAttached) {
      throw new NotFoundException(
        "Label is not assigned to this task",
      );
    }

    // Disconnect label
    return this.prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        labels: {
          disconnect: {
            id: labelId,
          },
        },
      },

      include: {
        assignee: true,
        creator: true,
        subtasks: true,
        comments: {
          include: {
            user: true,
          },
        },
        labels: true,
      },
    });
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateCommentDto } from "./dto/create-comment.dto.js";
import { CreateLabelDto } from "./dto/create-label.dto.js";
import { AssignLabelDto } from "./dto/assign-label.dto.js";
import { CreateTaskDto } from "./dto/create-task.dto.js";
import { UpdateTaskDto } from "./dto/update-task.dto.js";
import { CreateSubtaskDto } from "./dto/create-subtask.dto.js";
import { UpdateSubtaskDto } from "./dto/update-subtask.dto.js";

import { TasksService } from "./tasks.service.js";

@Controller("tasks")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  // ==========================================
  // TASK ROUTES
  // ==========================================

  @Post()
  create(
    @Body()
    createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      createTaskDto,
    );
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
  ) {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
    );
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
  ) {
    return this.tasksService.remove(id);
  }

  // ==========================================
  // SUBTASK ROUTES
  // ==========================================

  @Post(":taskId/subtasks")
  createSubtask(
    @Param("taskId") taskId: string,
    @Body()
    createSubtaskDto: CreateSubtaskDto,
  ) {
    return this.tasksService.createSubtask(
      taskId,
      createSubtaskDto,
    );
  }

  @Patch(
    ":taskId/subtasks/:subtaskId",
  )
  updateSubtask(
    @Param("taskId") taskId: string,
    @Param("subtaskId") subtaskId: string,
    @Body()
    updateSubtaskDto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(
      taskId,
      subtaskId,
      updateSubtaskDto,
    );
  }

  @Delete(
    ":taskId/subtasks/:subtaskId",
  )
  removeSubtask(
    @Param("taskId") taskId: string,
    @Param("subtaskId") subtaskId: string,
  ) {
    return this.tasksService.removeSubtask(
      taskId,
      subtaskId,
    );
  }

  // ==========================================
  // COMMENT ROUTES
  // ==========================================

  @Post(":taskId/comments")
  createComment(
    @Param("taskId") taskId: string,
    @Body()
    createCommentDto: CreateCommentDto,
  ) {
    return this.tasksService.createComment(
      taskId,
      createCommentDto,
    );
  }

  // ==========================================
  // LABEL ROUTES
  // ==========================================

  // Create a label for a workspace
  @Post(
    "workspace/:workspaceId/labels",
  )
  createLabel(
    @Param("workspaceId")
    workspaceId: string,
    @Body()
    createLabelDto: CreateLabelDto,
  ) {
    return this.tasksService.createLabel(
      workspaceId,
      createLabelDto,
    );
  }

  // Get all labels for a workspace
  @Get(
    "workspace/:workspaceId/labels",
  )
  getWorkspaceLabels(
    @Param("workspaceId")
    workspaceId: string,
  ) {
    return this.tasksService.getWorkspaceLabels(
      workspaceId,
    );
  }

  // Assign label to task
  @Post(":taskId/labels")
  assignLabel(
    @Param("taskId") taskId: string,
    @Body()
    assignLabelDto: AssignLabelDto,
  ) {
    return this.tasksService.assignLabel(
      taskId,
      assignLabelDto,
    );
  }

  // Remove label from task
  @Delete(
    ":taskId/labels/:labelId",
  )
  removeLabel(
    @Param("taskId") taskId: string,
    @Param("labelId") labelId: string,
  ) {
    return this.tasksService.removeLabel(
      taskId,
      labelId,
    );
  }
}
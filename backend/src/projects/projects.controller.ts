import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { CreateProjectDto } from "./dto/create-project.dto.js";
import { UpdateProjectDto } from "./dto/update-project.dto.js";
import { ProjectsService } from "./projects.service.js";

@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  // =====================================================
  // POST /projects
  // =====================================================

  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(
      createProjectDto,
    );
  }

  // =====================================================
  // GET /projects
  //
  // Optional:
  // GET /projects?workspaceId=xxxx
  // =====================================================

  @Get()
  findAll(
    @Query("workspaceId")
    workspaceId?: string,
  ) {
    return this.projectsService.findAll(
      workspaceId,
    );
  }

  // =====================================================
  // GET /projects/:id
  // =====================================================

  @Get(":id")
  findOne(
    @Param(
      "id",
      new ParseUUIDPipe(),
    )
    id: string,
  ) {
    return this.projectsService.findOne(
      id,
    );
  }

  // =====================================================
  // PATCH /projects/:id
  // =====================================================

  @Patch(":id")
  update(
    @Param(
      "id",
      new ParseUUIDPipe(),
    )
    id: string,

    @Body()
    updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      id,
      updateProjectDto,
    );
  }

  // =====================================================
  // DELETE /projects/:id
  // =====================================================

  @Delete(":id")
  remove(
    @Param(
      "id",
      new ParseUUIDPipe(),
    )
    id: string,
  ) {
    return this.projectsService.remove(
      id,
    );
  }
}
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma.service.js";

import { CreateProjectDto } from "./dto/create-project.dto.js";
import { UpdateProjectDto } from "./dto/update-project.dto.js";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =====================================================
  // Validate workspace
  // =====================================================

  private async ensureWorkspaceExists(
    workspaceId: string,
  ) {
    const workspace =
      await this.prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
      });

    if (!workspace) {
      throw new NotFoundException(
        "Workspace not found",
      );
    }

    return workspace;
  }

  // =====================================================
  // Validate project lead
  // =====================================================

  private async ensureLeadBelongsToWorkspace(
    workspaceId: string,
    leadId?: string | null,
  ) {
    if (!leadId) {
      return;
    }

    const member =
      await this.prisma.workspaceMember.findUnique(
        {
          where: {
            workspaceId_userId: {
              workspaceId,
              userId: leadId,
            },
          },
          include: {
            user: true,
          },
        },
      );

    if (!member) {
      throw new BadRequestException(
        "Project lead must be a member of the workspace",
      );
    }

    return member.user;
  }

  // =====================================================
  // Create Project
  // =====================================================

  async create(createProjectDto: CreateProjectDto) {
    const {
      name,
      description,
      priority,
      dueDate,
      workspaceId,
      leadId,
    } = createProjectDto;

    await this.ensureWorkspaceExists(
      workspaceId,
    );

    await this.ensureLeadBelongsToWorkspace(
      workspaceId,
      leadId,
    );

    return this.prisma.project.create({
      data: {
        name,
        description,
        priority,
        dueDate: dueDate
          ? new Date(dueDate)
          : undefined,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        lead: leadId
          ? {
              connect: {
                id: leadId,
              },
            }
          : undefined,
      },

      include: {
        lead: true,

        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },

        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  // =====================================================
  // Get All Projects
  // =====================================================

  async findAll(workspaceId?: string) {
    if (workspaceId) {
      await this.ensureWorkspaceExists(
        workspaceId,
      );
    }

    return this.prisma.project.findMany({
      where: workspaceId
        ? {
            workspaceId,
          }
        : undefined,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        lead: true,

        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  // =====================================================
  // Get Single Project
  // =====================================================

  async findOne(id: string) {
    const project =
      await this.prisma.project.findUnique({
        where: {
          id,
        },

        include: {
          lead: true,

          tasks: {
            orderBy: {
              createdAt: "desc",
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
          },

          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

    if (!project) {
      throw new NotFoundException(
        "Project not found",
      );
    }

    return project;
  }

  // =====================================================
  // Update Project
  // =====================================================

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const existingProject =
      await this.prisma.project.findUnique({
        where: {
          id,
        },
      });

    if (!existingProject) {
      throw new NotFoundException(
        "Project not found",
      );
    }

    if (
      updateProjectDto.leadId !==
        undefined &&
      updateProjectDto.leadId !== null
    ) {
      await this.ensureLeadBelongsToWorkspace(
        existingProject.workspaceId,
        updateProjectDto.leadId,
      );
    }

    const {
      name,
      description,
      priority,
      dueDate,
      leadId,
    } = updateProjectDto;

    return this.prisma.project.update({
      where: {
        id,
      },

      data: {
        ...(name !== undefined && {
          name,
        }),

        ...(description !== undefined && {
          description,
        }),

        ...(priority !== undefined && {
          priority,
        }),

        ...(dueDate !== undefined && {
          dueDate: dueDate
            ? new Date(dueDate)
            : null,
        }),

        ...(leadId !== undefined && {
          lead: leadId
            ? {
                connect: {
                  id: leadId,
                },
              }
            : {
                disconnect: true,
              },
        }),
      },

      include: {
        lead: true,

        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  // =====================================================
  // Delete Project
  // =====================================================

  async remove(id: string) {
    const project =
      await this.prisma.project.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      });

    if (!project) {
      throw new NotFoundException(
        "Project not found",
      );
    }

    /*
     * We don't delete the project's tasks.
     *
     * Because Task.projectId is optional and uses
     * onDelete: SetNull, deleting a project simply
     * removes the project association from its tasks.
     */

    await this.prisma.project.delete({
      where: {
        id,
      },
    });

    return {
      message: "Project deleted successfully",
      id,
    };
  }
}
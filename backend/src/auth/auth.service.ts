import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async guestLogin() {
    const guestEmail = "guest@taskflow.local";

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Find or create the guest user
      const user = await tx.user.upsert({
        where: {
          email: guestEmail,
        },
        update: {},
        create: {
          name: "Guest User",
          email: guestEmail,
        },
      });

      // 2. Find or create the guest workspace
      let workspace = await tx.workspace.findFirst({
        where: {
          ownerId: user.id,
          name: "TaskFlow Workspace",
        },
      });

      if (!workspace) {
        workspace = await tx.workspace.create({
          data: {
            name: "TaskFlow Workspace",
            ownerId: user.id,
          },
        });
      }

      // 3. Make sure the guest is a workspace member
      await tx.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: user.id,
          },
        },
        update: {
          role: "OWNER",
        },
        create: {
          workspaceId: workspace.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      return {
        user,
        workspace,
      };
    });

    return {
      message: "Guest login successful",
      user: result.user,
      workspace: result.workspace,
    };
  }
}
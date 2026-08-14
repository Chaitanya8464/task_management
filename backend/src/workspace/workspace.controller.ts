import { Controller, Get, Param } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service.js";

@Controller("workspaces")
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Get(":workspaceId/members")
  async getMembers(
    @Param("workspaceId") workspaceId: string,
  ) {
    return this.workspaceService.getMembers(workspaceId);
  }
}
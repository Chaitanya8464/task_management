import { Module } from "@nestjs/common";
import { ProjectsModule } from "./projects/projects.module.js";

import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { PrismaModule } from "./prisma.module.js";
import { TasksModule } from "./tasks/tasks.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { WorkspaceModule } from "./workspace/workspace.module.js";
@Module({
  imports: [
    PrismaModule,
    TasksModule,
    AuthModule,
     ProjectsModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
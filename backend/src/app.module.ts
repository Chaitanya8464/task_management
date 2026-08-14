import { Module } from "@nestjs/common";

import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { PrismaModule } from "./prisma.module.js";
import { TasksModule } from "./tasks/tasks.module.js";
import { AuthModule } from "./auth/auth.module.js";

@Module({
  imports: [
    PrismaModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
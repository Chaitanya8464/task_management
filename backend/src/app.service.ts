import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    const userCount = await this.prisma.user.count();

    return {
      message: "TaskFlow API is running",
      database: "connected",
      users: userCount,
    };
  }
}
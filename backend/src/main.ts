import "dotenv/config";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    "http://localhost:3000",
    "https://task-management-tau-rust.vercel.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
  origin: true,
  credentials: true,
  methods: [
    "GET",
    "HEAD",
    "PUT",
    "PATCH",
    "POST",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 3001;

  await app.listen(port, "0.0.0.0");

  console.log(
    `TaskFlow API running on port ${port}`,
  );
}

bootstrap();
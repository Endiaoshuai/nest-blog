import "source-map-support/register";

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";

(async () => {
  // 创建服务器实例
  const app = await NestFactory.create(AppModule);

  // 获取配置
  const configService = app.get(ConfigService);

  // 使用 pino 日志
  app.useLogger(app.get(Logger));

  // 启用跨域
  app.enableCors();

  // 全局使用验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 启动服务器
  await app.listen(Number(configService.get("PORT", 5000)));
})();

import { Module, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerModule } from "nestjs-pino";
import path from "path";
import { SnakeNamingStrategy } from "typeorm-snake-naming-strategy";

import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      exclude: [{ method: RequestMethod.ALL, path: "graphql" }],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        url: configService.get("DATABASE_URL"),
        entities: [path.join(__dirname, "/**/*.entity{.ts,.js}")],
        synchronize: configService.get<boolean>("DATABASE_SYNC", true),
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    AuthModule,
    PostModule,
    UserModule,
  ],
})
export class AppModule {}

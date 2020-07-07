import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET", "secret"),
        signOptions: { expiresIn: configService.get("JWT_EXPIRES_IN", "1d") },
      }),
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    UserModule,
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

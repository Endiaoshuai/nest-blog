import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET", "secret"),
    });
  }

  async validate(payload: { sub: User["id"] }): Promise<User> {
    if (payload?.sub) {
      const user = await this.userService.findOne(payload.sub);

      if (user) {
        return user;
      }
    }

    throw new UnauthorizedException();
  }
}

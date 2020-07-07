import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";

import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    readonly jwtService: JwtService,
    readonly userService: UserService
  ) {
    return this;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("The user does not exist.");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Your password is incorrect.");
    }

    return user;
  }

  async generateToken(user: User): Promise<string> {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}

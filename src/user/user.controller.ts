import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PostService } from "../post/post.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CreateUserInput } from "./inputs/create-user.input";
import { UpdateUserInput } from "./inputs/update-user.input";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(
    readonly userService: UserService,
    readonly postService: PostService
  ) {
    return this;
  }

  @Get("/user/:id")
  async user(@Param("id") id: string): Promise<User> {
    console.log("id", id);
    const user = await this.userService.findOneById(id);
    return user;
  }

  @Get("/users")
  async users(@Query() query: { take: number; skip: number }): Promise<User[]> {
    return this.userService.find(query.take, query.skip);
  }

  @Post("/user")
  async createUser(@Body() input: CreateUserInput): Promise<User> {
    console.log(input);
    return this.userService.createUser(input);
  }

  // 使用守卫， updateUser 这个方法必须通过 jwt 验证
  @UseGuards(AuthGuard("jwt"))
  @Put("/user")
  async updateUser(
    @CurrentUser() user: User,
    @Body() input: UpdateUserInput
  ): Promise<User> {
    return this.userService.updateUser(user, input);
  }
}

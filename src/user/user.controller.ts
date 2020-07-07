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
  async user(@Param() params: { id: string }): Promise<User> {
    const id = params.id;
    console.log("id", id);
    const user = await this.userService.findOne(id);
    return user;
  }

  @Get("/users")
  async users(@Query() query: { take: number; skip: number }): Promise<User[]> {
    console.log(query.take, typeof query.take);
    return this.userService.find({
      take: query.take,
      skip: query.skip,
    });
  }

  @Post("/user")
  async createUser(@Body() input: CreateUserInput): Promise<User> {
    console.log(input);
    const user = this.userService.create(input);
    return this.userService.save(user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/user")
  async updateUser(
    @CurrentUser() user: User,
    @Body() input: UpdateUserInput
  ): Promise<User> {
    Object.keys(input).forEach((key) => {
      user[key] = input[key];
    });

    return this.userService.save(user);
  }
}

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
import { PostService } from "src/post/post.service";

import { AuthGuard } from "../auth/auth.guard";
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
    return this.userService.findOne(id);
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

  @UseGuards(AuthGuard)
  @Put("/user/:id")
  async updateUser(
    @Param() params: { id: string },
    @Body() input: UpdateUserInput
  ): Promise<User> {
    const user = await this.userService.findOne(params.id);

    Object.keys(input).forEach((key) => {
      user[key] = input[key];
    });

    return this.userService.save(user);
  }
}

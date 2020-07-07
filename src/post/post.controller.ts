import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/user/decorators/current-user.decorator";
import { User } from "src/user/user.entity";

import { CreatePostInput } from "./inputs/create-post.input";
import { UpdatePostInput } from "./inputs/update-post.input";
import { Post as PostEntity } from "./post.entity";
import { PostService } from "./post.service";

@Controller()
export class PostController {
  constructor(readonly postService: PostService) {
    return this;
  }

  @Get("/post/:id")
  async post(@Param() params: { id: string }): Promise<PostEntity> {
    return this.postService.findOne(params.id);
  }

  @Get("/posts")
  async posts(
    @Query() query: { take: number; skip: number }
  ): Promise<PostEntity[]> {
    console.log(query.take, typeof query.take);
    return this.postService.find({
      relations: ["author"],
      take: query.take,
      skip: query.skip,
    });
  }

  @Post("/post")
  @UseGuards(AuthGuard("jwt"))
  async createPost(
    @CurrentUser() user: User,
    @Body() input: CreatePostInput
  ): Promise<PostEntity> {
    const post = await this.postService.create({ authorId: user.id, ...input });

    return this.postService.save(post);
  }

  @Put("/post/:id")
  @UseGuards(AuthGuard("jwt"))
  async updatePost(
    @CurrentUser() user: User,
    @Param() param: { id: string },
    @Body() input: UpdatePostInput
  ): Promise<PostEntity> {
    const post = await this.postService.findOne(param.id);

    console.log(post, user);

    if (post.authorId !== user.id) {
      throw new UnauthorizedException();
    }

    Object.keys(input).forEach((key) => {
      post[key] = input[key];
    });

    return this.postService.save(post);
  }

  @Delete("/post/:id")
  async deletePost(@Param() param: { id: string }): Promise<PostEntity> {
    let post = await this.postService.findOne(param.id);

    post = await this.postService.remove(post);
    post.id = param.id;

    return post;
  }
}

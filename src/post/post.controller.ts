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

import { CurrentUser } from "..//user/decorators/current-user.decorator";
import { User } from "..//user/user.entity";
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
    return this.postService.findAllPosts(query.take, query.skip);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/post")
  async createPost(
    @CurrentUser() user: User,
    @Body() input: CreatePostInput
  ): Promise<PostEntity> {
    return this.postService.createPost(user, input);
  }

  @Put("/post/:id")
  @UseGuards(AuthGuard("jwt"))
  async updatePost(
    @CurrentUser() user: User,
    @Param() param: { id: string },
    @Body() input: UpdatePostInput
  ): Promise<PostEntity> {
    const post = await this.postService.findOne(param.id);

    console.log(post);

    if (post.authorId !== user.id) {
      throw new UnauthorizedException();
    }

    return this.postService.updatePost(post, input);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/post/:id")
  async deletePost(
    @CurrentUser() user: User,
    @Param() param: { id: string }
  ): Promise<PostEntity> {
    let post = await this.postService.findOne(param.id);

    if (post.authorId !== user.id) {
      throw new UnauthorizedException();
    }

    post = await this.postService.deletePost(post);
    post.id = param.id;

    return post;
  }
}

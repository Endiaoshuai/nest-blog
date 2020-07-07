import { Controller, Get, Param, Post, Query } from "@nestjs/common";

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
      take: query.take,
      skip: query.skip,
    });
  }
}

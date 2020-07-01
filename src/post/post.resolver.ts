import { UseGuards } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { QueryConnectionArgs } from "nest-graphql-relay";

import { AuthGuard } from "../auth/auth.guard";
import { Complexity } from "../common/decorators/complexity.decorator";
import { CurrentUser } from "../user/decorators/current-user.decorator";
import { UserDataLoader } from "../user/user.data-loader";
import { User } from "../user/user.entity";
import { CreatePostInput } from "./inputs/create-post.input";
import { UpdatePostInput } from "./inputs/update-post.input";
import { PostConnection } from "./objects/post-connection.object";
import { Post } from "./post.entity";
import { PostService } from "./post.service";

@Resolver(() => Post)
export class PostResolver {
  constructor(
    readonly userDataLoader: UserDataLoader,
    readonly postService: PostService
  ) {
    return this;
  }

  @Query(() => Post)
  async post(@Args("id", { type: () => ID }) id: string): Promise<Post> {
    return this.postService.findOne({
      where: { id },
    });
  }

  @Complexity(1, ["first", "last"])
  @Query(() => PostConnection)
  async posts(@Args() args: QueryConnectionArgs): Promise<PostConnection> {
    return this.postService.paginate(args);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user: User,
    @Args("input") input: CreatePostInput
  ): Promise<Post> {
    const post = this.postService.create({ ...input, author: user });
    return this.postService.save(post);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @Args("id", { type: () => ID }) id: string,
    @Args("input")
    input: UpdatePostInput
  ): Promise<Post> {
    const post = await this.postService.findOne({ where: { id } });

    Object.keys(input).forEach((key) => {
      post[key] = input[key];
    });

    return this.postService.save(post);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Post)
  async deletePost(@Args("id", { type: () => ID }) id: string): Promise<Post> {
    let post = await this.postService.findOne({ where: { id } });

    post = await this.postService.remove(post);
    post.id = id;

    return post;
  }

  @ResolveField(() => User)
  async author(@Parent() post: Post): Promise<User> {
    return this.userDataLoader.load(post.authorId);
  }
}

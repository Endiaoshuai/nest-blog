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
import { PostConnection } from "../post/objects/post-connection.object";
import { PostService } from "../post/post.service";
import { CreateUserInput } from "./inputs/create-user.input";
import { UpdateUserInput } from "./inputs/update-user.input";
import { UserConnection } from "./objects/user-connection.object";
import { UserDataLoader } from "./user.data-loader";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(
    readonly userDataLoader: UserDataLoader,
    readonly userService: UserService,
    readonly postService: PostService
  ) {
    return this;
  }

  @Query(() => User)
  async user(@Args("id", { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne({
      where: { id },
    });
  }

  @Complexity(1, ["first", "last"])
  @Query(() => UserConnection)
  async users(@Args() args: QueryConnectionArgs): Promise<UserConnection> {
    return this.userService.paginate(args);
  }

  @Mutation(() => User)
  async createUser(@Args("input") input: CreateUserInput): Promise<User> {
    const user = this.userService.create(input);
    return this.userService.save(user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args("id", { type: () => ID }) id: string,
    @Args("input")
    input: UpdateUserInput
  ): Promise<User> {
    const user = await this.userService.findOne({ where: { id } });

    Object.keys(input).forEach((key) => {
      user[key] = input[key];
    });

    return this.userService.save(user);
  }

  @Complexity(1, ["first", "last"])
  @ResolveField(() => PostConnection)
  async posts(
    @Parent() user: User,
    @Args() args: QueryConnectionArgs
  ): Promise<PostConnection> {
    return this.postService.paginate(args, { author: user });
  }
}

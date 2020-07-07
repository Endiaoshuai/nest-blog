import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { PostController } from "./post.controller";
import { PostDataLoader } from "./post.data-loader";
import { Post } from "./post.entity";
import { PostResolver } from "./post.resolver";
import { PostService } from "./post.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => UserModule)],
  providers: [PostResolver, PostService, PostDataLoader],
  exports: [PostService, PostDataLoader],
  controllers: [PostController],
})
export class PostModule {}

import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../user/user.module";
import { PostController } from "./post.controller";
import { Post } from "./post.entity";
import { PostService } from "./post.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => UserModule)],
  providers: [PostService],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}

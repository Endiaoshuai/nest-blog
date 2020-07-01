import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PostModule } from "../post/post.module";
import { UserDataLoader } from "./user.data-loader";
import { User } from "./user.entity";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => PostModule)],
  providers: [UserResolver, UserService, UserDataLoader],
  exports: [UserService, UserDataLoader],
})
export class UserModule {}

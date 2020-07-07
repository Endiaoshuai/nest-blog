import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EntityService } from "../common/services/entity.service";
import { Post } from "./post.entity";

@Injectable()
export class PostService extends EntityService<Post> {
  constructor(
    @InjectRepository(Post)
    readonly repository: Repository<Post>
  ) {
    super(repository);
    return this;
  }
}

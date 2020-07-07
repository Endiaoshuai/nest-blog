import { Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import DataLoader from "dataloader";
import { keyBy } from "lodash";
import { In, Repository } from "typeorm";

import { Post } from "./post.entity";

@Injectable({ scope: Scope.REQUEST })
export class PostDataLoader extends DataLoader<Post["id"], Post> {
  constructor(
    @InjectRepository(Post)
    readonly repository: Repository<Post>
  ) {
    super(async (ids: string[]) => {
      const result = keyBy(await this.repository.find({ id: In(ids) }), "id");
      return ids.map((id) => result[id]);
    });
  }
}

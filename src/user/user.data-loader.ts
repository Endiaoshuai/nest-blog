import { Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import DataLoader from "dataloader";
import { keyBy } from "lodash";
import { In, Repository } from "typeorm";

import { User } from "./user.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserDataLoader extends DataLoader<User["id"], User> {
  constructor(
    @InjectRepository(User)
    readonly repository: Repository<User>
  ) {
    super(async (ids: string[]) => {
      const result = keyBy(await this.repository.find({ id: In(ids) }), "id");
      return ids.map((id) => result[id]);
    });
  }
}

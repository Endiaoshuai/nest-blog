import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EntityService } from "../common/services/entity.service";
import { User } from "./user.entity";

@Injectable()
export class UserService extends EntityService<User> {
  constructor(
    @InjectRepository(User)
    readonly repository: Repository<User>
  ) {
    super(repository);
    return this;
  }
}

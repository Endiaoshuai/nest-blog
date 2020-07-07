import { Field, ID, InputType } from "@nestjs/graphql";
import { DeepPartial } from "typeorm";

import { User } from "../user.entity";

@InputType()
export class UpdateUserInput implements DeepPartial<User> {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  password?: string;
}

import { Field, ID, InputType } from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

import { User } from '../user.entity';

@InputType()
export class CreateUserInput implements DeepPartial<User> {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  slug?: string;

  @Field()
  password: string;
}

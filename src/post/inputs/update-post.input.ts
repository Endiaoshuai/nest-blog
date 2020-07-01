import { Field, ID, InputType } from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

import { Post } from '../post.entity';

@InputType()
export class UpdatePostInput implements DeepPartial<Post> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  markdown?: string;

  @Field({ nullable: true })
  publishedAt?: Date;
}

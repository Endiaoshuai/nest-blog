import { Field, ID, InputType } from '@nestjs/graphql';
import { DeepPartial } from 'typeorm';

import { Post } from '../post.entity';

@InputType()
export class CreatePostInput implements DeepPartial<Post> {
  @Field()
  title: string;

  @Field({ nullable: true })
  slug?: string;

  @Field()
  markdown: string;

  @Field({ nullable: true })
  publishedAt?: Date;
}

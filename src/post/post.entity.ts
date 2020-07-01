import { Field, ID, ObjectType } from "@nestjs/graphql";
import remark from "remark";
import remarkHtml from "remark-html";
import slugify from "slugify";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";

import { User } from "../user/user.entity";

@ObjectType()
@Entity()
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Index()
  @Column()
  slug: string;

  @Field()
  @Column({ type: "longtext" })
  markdown: string;

  @Field()
  @Column({ type: "longtext" })
  html: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Index()
  publishedAt: Date;

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Index()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @RelationId((post: Post) => post.author)
  authorId: User["id"];

  @BeforeInsert()
  @BeforeUpdate()
  _beforeInsertOrUpdate(): void {
    if (!this.slug) {
      this.slug = slugify(this.title);
    }

    this.html = String(remark().use(remarkHtml).processSync(this.markdown));
  }
}

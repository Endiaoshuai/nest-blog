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

@Entity()
export class Post {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ type: "longtext" })
  markdown: string;

  @Column({ type: "longtext" })
  html: string;

  @Column({ nullable: true })
  @Index()
  publishedAt: Date;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

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

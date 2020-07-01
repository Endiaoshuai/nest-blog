import { Field, ID, ObjectType } from "@nestjs/graphql";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Post } from "../post/post.entity";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Index()
  @Column()
  slug: string;

  @Field()
  @Index()
  @Column()
  email: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Index()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  #password: string;

  @AfterLoad()
  _afterLoad(): void {
    this.#password = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  _beforeInsertOrUpdate(): void {
    if (!this.slug) {
      this.slug = slugify(this.name);
    }

    if (this.#password !== this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
      this._afterLoad();
    }
  }
}

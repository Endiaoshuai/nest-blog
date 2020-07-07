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

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column()
  name: string;

  @Index()
  @Column()
  slug: string;

  @Index()
  @Column()
  email: string;

  @Column()
  password: string;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

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

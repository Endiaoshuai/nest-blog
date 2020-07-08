import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "..//user/user.entity";
import { CreatePostInput } from "./inputs/create-post.input";
import { UpdatePostInput } from "./inputs/update-post.input";
import { Post } from "./post.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    readonly postRepository: Repository<Post>
  ) {
    return this;
  }

  async findOne(id: string): Promise<Post> {
    return await this.postRepository.findOne(id);
  }

  async findAllPosts(take: number, skip: number): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ["author"],
      take,
      skip,
    });
  }

  async createPost(user: User, input: CreatePostInput): Promise<Post> {
    const Post = await this.postRepository.create({ author: user, ...input });
    return await this.postRepository.save(Post);
  }

  async updatePost(Post: Post, input: UpdatePostInput): Promise<Post> {
    Object.keys(input).forEach((key) => {
      Post[key] = input[key];
    });

    return await this.postRepository.save(Post);
  }

  async deletePost(post: Post): Promise<Post> {
    return await await this.postRepository.remove(post);
  }
}

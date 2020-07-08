import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

import { CreateUserInput } from "./inputs/create-user.input";
import { UpdateUserInput } from "./inputs/update-user.input";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>
  ) {
    return this;
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
    // return await this.userRepository.findOne({ where: { id: id } });
  }

  async findOne(option: FindOneOptions): Promise<User> {
    return await this.userRepository.findOne(option);
  }

  async find(take: number, skip: number): Promise<User[]> {
    return await this.userRepository.find({
      take,
      skip,
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const user = await this.userRepository.create(input);
    return await this.userRepository.save(user);
  }

  async updateUser(user: User, input: UpdateUserInput): Promise<User> {
    Object.keys(input).forEach((key) => {
      user[key] = input[key];
    });

    return await this.userRepository.save(user);
  }
}

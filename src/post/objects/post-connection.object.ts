import { ObjectType } from "@nestjs/graphql";
import { createConnection } from "nest-graphql-relay";

import { Post } from "../post.entity";

@ObjectType()
export class PostConnection extends createConnection(Post) {}

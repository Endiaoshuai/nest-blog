import { ObjectType } from '@nestjs/graphql';
import { createConnection } from 'nest-graphql-relay';

import { User } from '../user.entity';

@ObjectType()
export class UserConnection extends createConnection(User) {}

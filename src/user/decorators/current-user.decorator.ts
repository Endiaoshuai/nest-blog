import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '../user.entity';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = GqlExecutionContext.create(ctx).getContext().req;
    return request.user instanceof User ? request.user : null;
  },
);

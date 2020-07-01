import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(readonly authService: AuthService) {
    return this;
  }

  @Mutation(() => String)
  async getToken(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const user = await this.authService.validateUser(email, password);
    return this.authService.generateToken(user);
  }

  @Mutation(() => String)
  async refreshToken(@CurrentUser() user: User): Promise<string> {
    return this.authService.generateToken(user);
  }
}

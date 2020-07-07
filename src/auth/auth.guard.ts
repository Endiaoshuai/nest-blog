import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard as BaseAuthGuard } from "@nestjs/passport";
import { IncomingMessage } from "http";

@Injectable()
export class AuthGuard extends BaseAuthGuard("jwt") {
  public getRequest(context: ExecutionContext): IncomingMessage {
    const ctx = GqlExecutionContext.create(context);
    console.log("ctx111", ctx.getContext().req);

    return ctx.getContext().req;
  }
}

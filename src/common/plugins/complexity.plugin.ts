import { GraphQLSchemaHost, Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { UnauthorizedException } from '@nestjs/common';
import {
  directiveEstimator,
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';
import { PinoLogger } from 'nestjs-pino';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(
    readonly gqlSchemaHost: GraphQLSchemaHost,
    readonly logger: PinoLogger,
  ) {
    return this;
  }

  requestDidStart(): GraphQLRequestListener {
    const { schema } = this.gqlSchemaHost;

    return {
      didResolveOperation: ({ request, document }) => {
        const maxComplexity = 1000;

        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            directiveEstimator({
              name: 'complexity',
            }),
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        if (complexity >= maxComplexity) {
          throw new UnauthorizedException(
            `Query is too complex: ${complexity}. Maximum allowed complexity: ${maxComplexity}`,
          );
        }

        this.logger.info(
          { operationName: request.operationName, complexity },
          'query complexity',
        );
      },
    };
  }
}

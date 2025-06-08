import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ZodError } from "zod";

import { Controller } from "@application/contracts/Controller";
import { ApplicationError } from "@application/errors/application/ApplicationError";
import { ErrorCode } from "@application/errors/ErrorCode";
import { HttpError } from "@application/errors/http/HttpError";
import { lambdaBodyParse } from "@main/utils/lambdaBodyParse";
import { lambdaErrorResponse } from "@main/utils/lambdaErrorResponse";


export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};
      const body = lambdaBodyParse(event.body);

      const response = await controller.execute({
        params,
        queryParams,
        body
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          code: ErrorCode.VALIDATION_ERROR,
          message: error.issues.map(issue => ({
            field: issue.path.join('.'),
            error: issue.message
          })),
          statusCode: 400
        })
      };

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      if (error instanceof ApplicationError) {
        return lambdaErrorResponse({
          code: error.code,
          message: error.message,
          statusCode: error.statusCode ?? 400
        })
      }

      console.error(error);
      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        statusCode: 500,
      });
    }
  }
}

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { lambdaBodyParse } from "../utils/lambdaBodyParse";
import { IController } from "../../application/contracts/Controller";

export function lambdaHttpAdapter(controller: IController<unknown>) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const params = event.pathParameters ?? {};
    const queryParams = event.queryStringParameters ?? {};
    const body = lambdaBodyParse(event.body);

    const response = await controller.handle({
      params,
      queryParams,
      body
    });

    return {
      statusCode: response.statusCode,
      body: response.body ? JSON.stringify(response.body) : undefined
    }
  }
}

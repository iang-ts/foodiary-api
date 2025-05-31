import { APIGatewayProxyEventV2 } from "aws-lambda";

export function lambdaBodyParse(body: APIGatewayProxyEventV2['body']) {

  try {
    if (!body) {
      return {};
    }

    return JSON.parse(body);
  } catch (error) {
    throw new Error('Malformed JSON body');
  }
}

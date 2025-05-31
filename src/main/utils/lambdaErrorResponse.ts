interface ILambdaErrorResponseParams {
  statusCode: number;
  code: string;
  message: any;
}

export function lambdaErrorResponse({
  statusCode,
  code,
  message
}: ILambdaErrorResponseParams) {
  return {
    statusCode,
    body: JSON.stringify({
      error: {
        code,
        message,
      }
    }),
  }
}

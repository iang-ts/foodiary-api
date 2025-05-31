
export interface IController<Tbody = undefined> {
  handle(params: IController.Request): Promise<IController.Response<Tbody>>;
}

export namespace IController {
  export type Request<
    TBody = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>
  > = {
    body: TBody;
    params: TParams,
    queryParams: TQueryParams
  }

  export type Response<Tbody = undefined> = {
    statusCode: number;
    body?: Tbody;
  }
}

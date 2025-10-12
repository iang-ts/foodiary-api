import { Controller } from "@application/contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";


@Injectable()
export class CreateMealCoontroller extends Controller<'private', CreateMealCoontroller.Response> {
  protected override async handle({
    accountId
  }: Controller.Request<'private'>): Promise<Controller.Response<CreateMealCoontroller.Response>> {

    return {
      statusCode: 201,
      body: {
        accountId,
      }
    };
  }
}

export namespace CreateMealCoontroller {
  export type Response = {
    accountId: string;
  }
}

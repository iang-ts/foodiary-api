import { Controller } from "@application/contracts/Controller";
import { Meal } from "@application/entities/Meal";
import { CreateMealUseCase } from "@application/usecases/meals/CreateMealUseCase";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { CreateMealBody, createMealSchema } from "./schemas/createMealSchema";


@Injectable()
@Schema(createMealSchema)
export class CreateMealCoontroller extends Controller<'private', CreateMealCoontroller.Response> {
  constructor (private readonly createMealUseCase: CreateMealUseCase) {
    super()
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', CreateMealBody>): Promise<Controller.Response<CreateMealCoontroller.Response>> {
    const { file } = body;
    const inputType = (
      file.type === 'audio/m4a'
        ? Meal.InputTYpe.AUDIO
        : Meal.InputTYpe.PICTURE
    )

   const {
    mealId,
    uploadSignature,
   } = await this.createMealUseCase.execute({
    accountId,
    file: {
      size: file.size,
      inputType: inputType,
    }
   });

    return {
      statusCode: 201,
      body: {
        mealId,
        uploadSignature
      }
    };
  }
}

export namespace CreateMealCoontroller {
  export type Response = {
    mealId: string;
    uploadSignature: string;
  };
}

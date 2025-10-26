import { Meal } from "@application/entities/Meal";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { MealsFileStorageGatway } from "@infra/gateways/MealsFileStorageGateway";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class GetMealByIdUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorageGatway: MealsFileStorageGatway
  ) {}

  async execute({
    accountId,
    mealId
  }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
    const meal = await this.mealRepository.findById({
      accountId,
      mealId,
    });

    if (!meal) {
      throw new ResourceNotFound('Meal Not Found.')
    }

    const inputFileURL = this.mealsFileStorageGatway.getFileUrl(meal.inputFileKey);

    return {
      meal: {
        createdAt: meal.createdAt,
        foods: meal.foods,
        icon: meal.icon,
        id: meal.id,
        inputFileURL,
        inputType: meal.inputType,
        name: meal.name,
        status: meal.status,
      }
    }
  }
}

export namespace GetMealByIdUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputTYpe;
      inputFileURL: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}

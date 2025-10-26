import { Meal } from "@application/entities/Meal";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class GetMealByIdUseCase {
  constructor(private readonly mealRepository: MealRepository) {}

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

    return {
      meal: {
        createdAt: meal.createdAt,
        foods: meal.foods,
        icon: meal.icon,
        id: meal.id,
        inputFileKey: meal.inputFileKey,
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
      inputFileKey: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}

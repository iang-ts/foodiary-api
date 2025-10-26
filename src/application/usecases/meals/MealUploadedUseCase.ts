import { Meal } from "@application/entities/Meal";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { MealsFileStorageGatway } from "@infra/gateways/MealsFileStorageGateway";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class MealUploadedUseCase {
   constructor(
      private readonly mealRepository: MealRepository,
      private readonly mealsFileStorageGatway: MealsFileStorageGatway
    ) {}

    async execute({
      fileKey,
    }: MealUploadedUseCase.Input): Promise<MealUploadedUseCase.Output> {
      const { accountId, mealId } = await this.mealsFileStorageGatway.getFileMetadata({
        fileKey,
      })

      const meal = await this.mealRepository.findById({
        accountId,
        mealId
      });

      if (!meal) {
        throw new ResourceNotFound("Meal not found.")
      }

      meal.status = Meal.Status.QUEUED;

      await this.mealRepository.save(meal)
    }
}


export namespace MealUploadedUseCase {
  export type Input = {
    fileKey: string;
  };

  export type Output = void;
}

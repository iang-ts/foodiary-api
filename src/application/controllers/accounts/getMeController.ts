import { Controller } from "@application/contracts/Controller";
import { Profile } from "@application/entities/Profile";
import { GetProfileAndGoalQuery } from "@application/query/GetProfileAndGoalQuery";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class GetMeController extends Controller<
  "private",
  GetMeController.Response
> {
  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<GetMeController.Response>
  > {
    const { goal, profile } = await this.getProfileAndGoalQuery.execute({
      accountId,
    });

    return {
      statusCode: 200,
      body: {
        profile: {
          birthDate: profile.birthDate,
          gender: profile.gender,
          height: profile.height,
          name: profile.name,
          weight: profile.weight,
        },
        goal: {
          calories: goal.calories,
          carbohydrates: goal.carbohydrates,
          fats: goal.fats,
          proteins: goal.proteins,
        }
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      height: number;
      weight: number;
    };
    goal: {
      calories: number;
      carbohydrates: number;
      fats: number;
      proteins: number;
    };
  };
}

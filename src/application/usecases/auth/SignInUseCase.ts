import { InvalidCredentials } from "@application/errors/application/InvalidCredentials";
import { Injectable } from "@kernel/decorators/Injectable";
import { AuthGateway } from "src/infra/gateways/AuthGateway";

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
  ) { }

  async execute({
    email,
    password
  }: SignInUseCase.Input): Promise<SignInUseCase.Output> {
    try {
      const {
        accessToken,
        refreshToken
      } = await this.authGateway.signIn({ email, password });

      return {
        accessToken,
        refreshToken
      }
    } catch {
      throw new InvalidCredentials();
    }
  };
}

export namespace SignInUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}

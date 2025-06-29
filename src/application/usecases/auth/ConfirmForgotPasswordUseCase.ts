import { Injectable } from "@kernel/decorators/Injectable";
import { AuthGateway } from "src/infra/gateways/AuthGateway";

@Injectable()
export class ConfirmForgotPasswordUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
  ) { }

  async execute({
    confirmationCode,
    email,
    password,
  }: ConfirmForgotPasswordUseCase.Input): Promise<ConfirmForgotPasswordUseCase.Output> {
    await this.authGateway.confirmForgotPassword({
      confirmationCode,
      email,
      password,
    });
  };
}

export namespace ConfirmForgotPasswordUseCase {
  export type Input = {
    email: string;
    confirmationCode: string;
    password: string;
  };

  export type Output = void
}

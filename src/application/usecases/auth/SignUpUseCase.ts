import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class SignUpUseCase {
  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {

    return {
      accessToken: 'access Token gerado',
      refreshToken: 'Refresh gerado'
    }
  };
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}

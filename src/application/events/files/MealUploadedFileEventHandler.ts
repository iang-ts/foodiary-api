import { IFileEventHandler } from "@application/contracts/IFileEventHandler";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
    console.log({
      MealUploadedFileEventHandler: fileKey,
    });
  }
}

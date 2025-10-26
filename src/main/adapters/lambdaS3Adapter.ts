import { IFileEventHandler } from "@application/contracts/IFileEventHandler";
import { S3Handler } from "aws-lambda";

export function lambdaS3Adapter(eventHandler: IFileEventHandler): S3Handler {
  return async (event) => {
    const responses = await Promise.allSettled(
      event.Records.map((record) =>
        eventHandler.handle({
          fileKey: record.s3.object.key,
        })
      ),
    );

    const failedEvents = responses.filter(response => response.status === 'rejected');

    if (failedEvents.length > 0) {
      for (const event of failedEvents) {
        console.log(JSON.stringify(event, null, 2));
      }
    }
  };
}

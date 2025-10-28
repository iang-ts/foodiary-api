import OpenAI, { toFile } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { Meal } from "@application/entities/Meal";
import { Injectable } from "@kernel/decorators/Injectable";
import { downloadFileFromUrl } from "@shared/utils/downloadFileFromUrl";
import { ChatCompletionContentPart } from "openai/resources/index";
import { MealsFileStorageGatway } from "../../gateways/MealsFileStorageGateway";
import { getImagePrompt } from "../prompts/getImagePrompt";
import { getTextPrompt } from "../prompts/getTextPrompt";

const mealSchema = z.object({
  name: z.string(),
  icon: z.string(),
  foods: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
    calories: z.number(),
    carbohydrates: z.number(),
    fats: z.number(),
    proteins: z.number(),
  })),
});

@Injectable()
export class MealsAiGateway {
  constructor(private readonly mealsFileStorageGatway: MealsFileStorageGatway) { }

  private readonly client = new OpenAI();

  async processMeal(meal: Meal): Promise<MealsAiGateway.ProcessMealResult> {
    const mealFileUrl = this.mealsFileStorageGatway.getFileUrl(meal.inputFileKey)

    if (meal.inputType === Meal.InputTYpe.PICTURE) {
      return this.callAi({
        mealId: meal.id,
        systemPrompt: getImagePrompt(),
        userMessageParts: [
          {
            type: 'image_url',
            image_url: {
              url: mealFileUrl,
              detail: 'high',
            },
          },
          {
            type: 'text',
            text: `Meal Date: ${meal.createdAt}`
          }
        ]
      })
    }

    const transcription = await this.transcribe(mealFileUrl);

    return this.callAi({
      mealId: meal.id,
      systemPrompt: getTextPrompt(),
      userMessageParts: `Meal Date: ${meal.createdAt}\n\nMeal: ${transcription}`,
    })
  }

  private async transcribe(audioFileUrl: string) {
    const audioFile = await downloadFileFromUrl(audioFileUrl)

    const { text } = await this.client.audio.transcriptions.create({
      model: 'gpt-4o-mini-transcribe',
      file: await toFile(audioFile, 'audio.m4a', { type: 'audio/m4a' }),
    });

    return text
  }

  private async callAi({
    mealId,
    systemPrompt,
    userMessageParts,
  }: MealsAiGateway.CallAiParams): Promise<MealsAiGateway.ProcessMealResult> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: zodResponseFormat(mealSchema, "meal"),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessageParts,
        },
      ],
    });

    const json = response.choices[0].message.content;

    if (!json) {
      console.error("Openai response:", JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal "${mealId}"`);
    }

    const { success, data, error } = mealSchema.safeParse(JSON.parse(json));

    if (!success) {
      console.log("Zod error:", JSON.stringify(error.issues, null, 2));
      console.error("Openai response:", JSON.stringify(response, null, 2));
      throw new Error(`Failed processing meal "${mealId}"`);
    }

    return data;
  }
}

export namespace MealsAiGateway {
  export type ProcessMealResult = {
    name: string;
    icon: string;
    foods: Meal.Food[];
  }

  export type CallAiParams = {
    mealId: string;
    systemPrompt: string;
    userMessageParts: string | ChatCompletionContentPart[];
  }
}

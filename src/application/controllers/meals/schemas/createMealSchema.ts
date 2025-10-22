import { mbToBytes } from "@shared/utils/mbToBytes";
import { z } from "zod";

export const createMealSchema = z.object({
  file: z.object({
    type: z.enum(['audio/m4a', 'image/jpeg']),
    size: z.number()
    .min(1, 'The file should have at least 1 byte.')
    .max(mbToBytes(10), 'The file should have up to 10mb.'),
  }),
})


export type CreateMealBody = z.infer<typeof createMealSchema>;

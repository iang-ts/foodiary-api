import { Profile } from "@application/entities/Profile";
import { z } from "zod";

export const signUpSchema = z.object({
  account: z.object({
    email: z.string().min(1, "email is required").email("Invalid email format"),
    password: z.string().min(6, "password should be at least 6 characters long."),
  }),
  profile: z.object({
    name: z.string().min(1, "name is required"),
    birthDate: z.string()
      .min(1, "birthDate is required")
      .date("'birthDate' must be a valid date (YYYY-MM-DD)")
      .transform((date) => new Date(date)),
    gender: z.nativeEnum(Profile.Gender),
    height: z.number().min(1, "height is required"),
    weight: z.number().min(1, "weight is required"),
    activityLevel: z.nativeEnum(Profile.ActivityLevel),
  }),
})


export type SignUpBody = z.infer<typeof signUpSchema>;

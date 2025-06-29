import { z } from "zod";

export const confirmForgotPasswordSchema = z.object({
    email: z.string().min(1, "email is required").email("Invalid email format"),
    confirmationCode: z.string().min(1, "confirmation code is required"),
    password: z.string().min(6, "password should be at least 6 characters long."),
})


export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>;

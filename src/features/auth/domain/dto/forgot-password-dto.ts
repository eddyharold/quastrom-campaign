import { z } from "zod";

export const ForgotPasswordDtoSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Enter a valid email address",
    }),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>;

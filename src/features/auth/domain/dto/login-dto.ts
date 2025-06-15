import { z } from "zod";

export const LoginDtoSchema = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Enter a valid email address",
    }),
  password: z.string({
    message: "Password is required",
  }),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

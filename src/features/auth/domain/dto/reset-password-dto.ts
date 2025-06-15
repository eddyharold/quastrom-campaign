import { z } from "zod";

export const ResetPasswordDtoSchema = z
  .object({
    code: z.string({
      message: "Password reset code is required",
    }),
    password: z.string({
      message: "Password is required",
    }),
    confirm_password: z.string({
      message: "Password  is required",
    }),
  })
  .refine(
    (values) => {
      return values.password === values.confirm_password;
    },
    {
      message: "Passwords must match!",
      path: ["confirm_password"],
    }
  );

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

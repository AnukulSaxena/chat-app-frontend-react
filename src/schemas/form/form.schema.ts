import { z } from "zod";

export const formSchema = z.object({
  userName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;
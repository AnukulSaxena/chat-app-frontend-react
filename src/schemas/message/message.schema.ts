import { z } from "zod";

export const messageSchema = z.object({
  _id: z.optional(z.string()),
  sender: z.string(),
  text: z.string(),
  chat: z.string(),
  timeStamp: z.optional(z.string()),
  createdAt: z.optional(z.string()),
  updatedAt: z.optional(z.string()),
});

export const messageResponseSchema = z.object({
    data: z.array(messageSchema),
    message: z.string()
})

export type Message = z.infer<typeof messageSchema>;
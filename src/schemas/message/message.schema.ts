import { z } from "zod";

export const messageSchema = z.object({
  _id: z.string(),
  sender: z.string(),
  text: z.string(),
  chat: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const messageResponseSchema = z.object({
    data: z.array(messageSchema),
    message: z.string()
})

export type Message = z.infer<typeof messageSchema>;
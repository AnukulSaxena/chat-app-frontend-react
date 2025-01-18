import z from "zod";

export const ChatSchema =  z.object({
    _id: z.string(),
    isGroup: z.boolean(),
    users: z.array(
      z.object({
        _id: z.string(),
        userName: z.string(),
      })
    ),
  })

export const getChatSchema = z.object({
  data: z.array(
   ChatSchema
  ),
});

export type Chat = z.infer<typeof ChatSchema>;
import { z } from 'zod';

const schema = z.object({
  id: z.coerce.number(),
  message: z.string().min(1).max(100),
});

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseMessage = (message: unknown) =>
  schema.shape.message.parse(message);

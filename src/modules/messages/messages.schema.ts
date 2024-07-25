import { z } from "zod";

const sprintCodePattern = /^[A-Z]{2}-[1-9]+\.[1-9]+$/;

const schema = z.object({
    // positive integer
    sprint_code: z.string().regex(sprintCodePattern, {
        message: "Invalid sprint code! Format example: WD-1.1",
    }),
    username: z.string().min(1).max(32),
});

export const parseSprintCode = (sprint_code: unknown) =>
    schema.shape.sprint_code.parse(sprint_code);
export const parseUsername = (username: unknown) =>
    schema.shape.username.parse(username);

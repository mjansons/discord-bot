import { z } from "zod";

const sprintCodePattern = /^[A-Z]{2}-[1-9]+\.[1-9]+$/;

//sprintCode, title
const schema = z.object({
    // positive integer
    sprint_code: z.string().regex(sprintCodePattern, {
        message: "Invalid sprint code! Format example: WD-1.1",
    }),
    title: z.string().min(1).max(100),
});

export const parseSprintCode = (sprint_code: unknown) =>
    schema.shape.sprint_code.parse(sprint_code);
export const parseTitle = (title: unknown) =>
    schema.shape.title.parse(title);

import { z } from "zod";
import { ErreurMessages } from "../utils/errorsMessage.js";
export const MessageZode = z.object({
    nameFadil: z.string().min(1, ErreurMessages.missingUserName),
    descriptionFadil: z.string().min(4).max(200),
    startDate: z.string().optional(),
    endDate: z.string().optional()
});
export const StatusZod = z.object({
    status: z.enum(["EN_COURS", "TERMINEE"]),
});
//# sourceMappingURL=FadildevValidator.js.map
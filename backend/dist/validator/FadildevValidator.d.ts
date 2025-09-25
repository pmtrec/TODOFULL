import { z } from "zod";
export declare const MessageZode: z.ZodObject<{
    nameFadil: z.ZodString;
    descriptionFadil: z.ZodString;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const StatusZod: z.ZodObject<{
    status: z.ZodEnum<{
        EN_COURS: "EN_COURS";
        TERMINEE: "TERMINEE";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=FadildevValidator.d.ts.map
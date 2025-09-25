import { type taskFadil } from "@prisma/client";
export declare class TachFadil {
    private prisma;
    findAll(userId: number): Promise<taskFadil[]>;
    findById(id: number): Promise<taskFadil | null>;
    create(data: Omit<taskFadil, "id">): Promise<taskFadil>;
    update(id: number, data: Partial<Omit<taskFadil, "id">>): Promise<taskFadil>;
    delete(id: number): Promise<void>;
    updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil>;
}
//# sourceMappingURL=TachFadil.d.ts.map
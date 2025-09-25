import { taskFadil } from "@prisma/client";
export declare class FadildevService {
    private fadilRepo;
    findAll(userId: number): Promise<taskFadil[]>;
    findbyId(id: number): Promise<taskFadil | null>;
    create(data: Omit<taskFadil, "id">): Promise<taskFadil>;
    update(id: number, data: Partial<Omit<taskFadil, "id">>): Promise<taskFadil>;
    updatestatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil>;
    createFadiltask(data: Omit<taskFadil, "id">): Promise<taskFadil>;
    updateFadildev(id: number, data: Partial<Omit<taskFadil, "id">>): Promise<taskFadil>;
    deleteFadildev(id: number): Promise<void>;
    updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil>;
}
//# sourceMappingURL=FadildevService.d.ts.map
import { TachFadil } from "../repositories/TachFadil.js";
export class FadildevService {
    fadilRepo = new TachFadil;
    async findAll(userId) {
        return await this.fadilRepo.findAll(userId);
    }
    async findbyId(id) {
        return await this.fadilRepo.findById(id);
    }
    async create(data) {
        return await this.fadilRepo.create(data);
    }
    async update(id, data) {
        return await this.fadilRepo.update(id, data);
    }
    async updatestatus(id, status) {
        return await this.fadilRepo.updateStatus(id, status);
    }
    //  private repo: TachFadil = new TachFadil;
    //  getAllTaskFadil(userId:number): Promise<taskFadil[]> {
    //     return this.repo.findAll(userId);
    // }
    //  findFadiltaskById(id: number): Promise<taskFadil | null> {
    //     return this.repo.findById(id);
    // }
    createFadiltask(data) {
        return this.fadilRepo.create(data);
    }
    updateFadildev(id, data) {
        return this.fadilRepo.update(id, data);
    }
    async deleteFadildev(id) {
        await this.fadilRepo.delete(id);
    }
    updateStatus(id, status) {
        return this.fadilRepo.update(id, { status });
    }
}
//# sourceMappingURL=FadildevService.js.map
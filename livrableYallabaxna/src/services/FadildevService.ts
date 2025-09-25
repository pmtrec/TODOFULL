import  {taskFadil } from "@prisma/client";
import  { TachFadil } from "../repositories/TachFadil.js";


export class FadildevService {
    private fadilRepo:TachFadil = new TachFadil; 

    async findAll(userId:number):Promise<taskFadil[]>{
        return await this.fadilRepo.findAll(userId); 
    }

    async findbyId(id : number):Promise<taskFadil|null>{
        return await this.fadilRepo.findById(id)
    }

    async create(data: Omit<taskFadil, "id">):Promise<taskFadil>{
        return await this.fadilRepo.create(data)
    }

    async update(id: number, data:Partial<Omit<taskFadil, "id">>):Promise<taskFadil>{
        return await this.fadilRepo.update(id, data)
    }

    async updatestatus(id:number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil>{
        return await this.fadilRepo.updateStatus(id, status)
    }
   
    //  private repo: TachFadil = new TachFadil;

    //  getAllTaskFadil(userId:number): Promise<taskFadil[]> {
    //     return this.repo.findAll(userId);
    // }

    //  findFadiltaskById(id: number): Promise<taskFadil | null> {
    //     return this.repo.findById(id);
    // }

    createFadiltask(data: Omit<taskFadil, "id">): Promise<taskFadil> {

        return this.fadilRepo.create(data);
    }

    updateFadildev(
        id: number,
        data: Partial<Omit<taskFadil, "id">>
    ): Promise<taskFadil> {
        return this.fadilRepo.update(id, data);
    }

    async deleteFadildev(id: number): Promise<void> {
        await this.fadilRepo.delete(id);
    }

    updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
        return this.fadilRepo.update(id, { status });
    }

//     updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
//     return this.fadilRepo.updatestatus(id, status); 
// }

   

}



















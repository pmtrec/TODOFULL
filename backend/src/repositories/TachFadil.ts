import { type taskFadil} from "@prisma/client";
import prisma from "../config/database.js";


export class TachFadil {
    private prisma = prisma;

    
async findAll(userId:number): Promise<taskFadil[]> {
        return this.prisma.taskFadil.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                assignedUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                chat: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        timestamp: 'asc'
                    }
                }
            }
        });
    }

    async findById(id: number): Promise<taskFadil | null> {
        return this.prisma.taskFadil.findUnique({
            where: { id }
        });
    }

    

    async create(data: Omit<taskFadil, "id">): Promise<taskFadil> {
        return this.prisma.taskFadil.create({ data });
    }

    async update(
        id: number,
        data: Partial<Omit<taskFadil, "id" >>
    ): Promise<taskFadil> {
        return this.prisma.taskFadil.update({ where: { id }, data });
    }

 async delete(id: number): Promise<void> {
     // First delete all permissions associated with this task
     await this.prisma.permission.deleteMany({
         where: { taskId: id }
     });

     // Then delete the task
     await this.prisma.taskFadil.delete({ where: { id } })
}

// async updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
//         return this.prisma.taskFadil.update({
//             where: { id },
//             data: { status }
//         });
//     }


async updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
    return this.prisma.taskFadil.update({
        where: { id },
        data: { status } 
    });
}


}
 




















// async findAll(userId:number): Promise<taskFadil[]> {
//         return this.prisma.taskFadil.findMany({
//             where:{userId}
//         });
//     }

//     async findById(id: number): Promise<taskFadil | null> {
//         return this.prisma.taskFadil.findUnique({
//             where: { id }
//         });
//     }

    

//     async create(data: Omit<taskFadil, "id">): Promise<taskFadil> {
//         return this.prisma.taskFadil.create({ data });
//     }

//     async update(
//         id: number,
//         data: Partial<Omit<taskFadil, "id" >>
//     ): Promise<taskFadil> {
//         return this.prisma.taskFadil.update({ where: { id }, data });
//     }

//  async delete(id: number): Promise<void> {
//      this.prisma.taskFadil.delete({ where: { id } })
// }

// // async updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
// //         return this.prisma.taskFadil.update({
// //             where: { id },
// //             data: { status }
// //         });
// //     }


// async updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
//     return this.prisma.taskFadil.update({
//         where: { id },
//         data: { status } 
//     });
// }
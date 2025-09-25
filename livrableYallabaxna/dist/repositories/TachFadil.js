import prisma from "../config/database.js";
export class TachFadil {
    prisma = prisma;
    async findAll(userId) {
        return this.prisma.taskFadil.findMany({
            where: { userId },
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
    async findById(id) {
        return this.prisma.taskFadil.findUnique({
            where: { id }
        });
    }
    async create(data) {
        return this.prisma.taskFadil.create({ data });
    }
    async update(id, data) {
        return this.prisma.taskFadil.update({ where: { id }, data });
    }
    async delete(id) {
        // First delete all permissions associated with this task
        await this.prisma.permission.deleteMany({
            where: { taskId: id }
        });
        // Then delete the task
        await this.prisma.taskFadil.delete({ where: { id } });
    }
    // async updateStatus(id: number, status: "EN_COURS" | "TERMINEE"): Promise<taskFadil> {
    //         return this.prisma.taskFadil.update({
    //             where: { id },
    //             data: { status }
    //         });
    //     }
    async updateStatus(id, status) {
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
//# sourceMappingURL=TachFadil.js.map
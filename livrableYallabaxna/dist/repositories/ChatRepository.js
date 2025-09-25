import prisma from "../config/database.js";
export class ChatRepository {
    prisma = prisma;
    async findByTaskId(taskId) {
        return this.prisma.chat.findMany({
            where: { taskId },
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
        });
    }
    async create(message, userId, taskId) {
        return this.prisma.chat.create({
            data: {
                message,
                userId,
                taskId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
    async findById(id) {
        return this.prisma.chat.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=ChatRepository.js.map
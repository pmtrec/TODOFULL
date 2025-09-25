import { Chat } from "@prisma/client";
import prisma from "../config/database.js";

export class ChatRepository {
    private prisma = prisma;

    async findByTaskId(taskId: number): Promise<Chat[]> {
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

    async create(message: string, userId: number, taskId: number): Promise<Chat> {
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

    async findById(id: number): Promise<Chat | null> {
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
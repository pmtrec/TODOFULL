import { Chat } from "@prisma/client";
export declare class ChatRepository {
    private prisma;
    findByTaskId(taskId: number): Promise<Chat[]>;
    create(message: string, userId: number, taskId: number): Promise<Chat>;
    findById(id: number): Promise<Chat | null>;
}
//# sourceMappingURL=ChatRepository.d.ts.map
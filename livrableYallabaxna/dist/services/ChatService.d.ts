export declare class ChatService {
    private chatRepository;
    getChatMessages(taskId: number): Promise<{
        id: number;
        userId: number;
        timestamp: Date;
        message: string;
        taskId: number;
    }[]>;
    addChatMessage(message: string, userId: number, taskId: number): Promise<{
        id: number;
        userId: number;
        timestamp: Date;
        message: string;
        taskId: number;
    }>;
}
//# sourceMappingURL=ChatService.d.ts.map
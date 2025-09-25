import { ChatRepository } from "../repositories/ChatRepository.js";

export class ChatService {
    private chatRepository = new ChatRepository();

    async getChatMessages(taskId: number) {
        return this.chatRepository.findByTaskId(taskId);
    }

    async addChatMessage(message: string, userId: number, taskId: number) {
        return this.chatRepository.create(message, userId, taskId);
    }
}
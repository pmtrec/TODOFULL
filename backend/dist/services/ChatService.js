import { ChatRepository } from "../repositories/ChatRepository.js";
export class ChatService {
    chatRepository = new ChatRepository();
    async getChatMessages(taskId) {
        return this.chatRepository.findByTaskId(taskId);
    }
    async addChatMessage(message, userId, taskId) {
        return this.chatRepository.create(message, userId, taskId);
    }
}
//# sourceMappingURL=ChatService.js.map
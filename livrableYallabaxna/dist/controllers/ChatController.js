import { ChatService } from "../services/ChatService.js";
const chatService = new ChatService();
export class ChatController {
    static async getChatMessages(req, res) {
        try {
            const taskId = Number(req.params.taskId);
            const messages = await chatService.getChatMessages(taskId);
            res.json(messages);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addChatMessage(req, res) {
        try {
            const taskId = Number(req.params.taskId);
            const { message } = req.body;
            const userId = req.user.userId;
            if (!message || !message.trim()) {
                return res.status(400).json({ error: "Message is required" });
            }
            const newMessage = await chatService.addChatMessage(message.trim(), userId, taskId);
            return res.status(201).json(newMessage);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=ChatController.js.map
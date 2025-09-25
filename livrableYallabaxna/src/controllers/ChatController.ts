import { Response } from "express";
import { ChatService } from "../services/ChatService.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

const chatService = new ChatService();

export class ChatController {
    static async getChatMessages(req: AuthRequest, res: Response) {
        try {
            const taskId = Number(req.params.taskId);
            const messages = await chatService.getChatMessages(taskId);
            res.json(messages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addChatMessage(req: AuthRequest, res: Response) {
        try {
            const taskId = Number(req.params.taskId);
            const { message } = req.body;
            const userId = req.user!.userId;

            if (!message || !message.trim()) {
                return res.status(400).json({ error: "Message is required" });
            }

            const newMessage = await chatService.addChatMessage(message.trim(), userId, taskId);
            return res.status(201).json(newMessage);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
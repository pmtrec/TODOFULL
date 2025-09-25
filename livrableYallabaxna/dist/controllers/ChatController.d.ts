import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
export declare class ChatController {
    static getChatMessages(req: AuthRequest, res: Response): Promise<void>;
    static addChatMessage(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ChatController.d.ts.map
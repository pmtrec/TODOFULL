import { Router } from "express";
import { ChatController } from "../controllers/ChatController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/:taskId/messages", ChatController.getChatMessages);
router.post("/:taskId/messages", ChatController.addChatMessage);

export default router;
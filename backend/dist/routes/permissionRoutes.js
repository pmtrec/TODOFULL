import { Router } from "express";
import { PermissionController } from "../controllers/PermissionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = Router();
router.post("/permission", authenticate, PermissionController.givePermission);
export default router;
//# sourceMappingURL=permissionRoutes.js.map
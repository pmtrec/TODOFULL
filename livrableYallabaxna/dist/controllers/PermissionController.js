import { PermissionService } from "../services/PermissionService.js";
import { StatusCodes } from "../validator/statusCodes.js";
const service = new PermissionService();
export class PermissionController {
    static async givePermission(req, res) {
        try {
            const { taskId, email, type } = req.body;
            if (!taskId || !email || !type) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Champs manquants" });
            }
            const permission = await service.givePermission(taskId, email, type);
            return res.status(StatusCodes.SUCCESS).json(permission);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
//# sourceMappingURL=PermissionController.js.map
import { PermissionRepository } from "../repositories/PermissionRepository.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class PermissionService {
    repo = new PermissionRepository();
    async givePermission(taskId, email, type) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error("Utilisateur introuvable");
        return this.repo.givePermission(taskId, user.id, type);
    }
}
//# sourceMappingURL=PermissionService.js.map
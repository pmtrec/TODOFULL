import { PrismaClient } from "@prisma/client";
export class PermissionRepository {
    prisma = new PrismaClient();
    async givePermission(taskId, userId, type) {
        return this.prisma.permission.create({
            data: { taskId, userId, type },
        });
    }
    async findPermissionsByTask(taskId) {
        return this.prisma.permission.findMany({
            where: { taskId },
        });
    }
    async findUserPermissions(userId, taskId) {
        return this.prisma.permission.findMany({
            where: { taskId, userId },
        });
    }
}
//# sourceMappingURL=PermissionRepository.js.map
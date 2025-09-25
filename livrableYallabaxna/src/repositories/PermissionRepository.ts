import { PrismaClient, Permission, PermissionType } from "@prisma/client";

export class PermissionRepository {
  private prisma = new PrismaClient();

  async givePermission(
    taskId: number,
    userId: number,
    type: PermissionType
  ): Promise<Permission> {
    return this.prisma.permission.create({
      data: { taskId, userId, type },
    });
  }

  async findPermissionsByTask(taskId: number): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { taskId },
    });
  }

  async findUserPermissions(userId: number, taskId: number): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { taskId, userId },
    });
  }
}


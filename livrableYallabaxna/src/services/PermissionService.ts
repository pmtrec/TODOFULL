import { PermissionRepository } from "../repositories/PermissionRepository.js";
import { PrismaClient, PermissionType, User } from "@prisma/client";

const prisma = new PrismaClient();

export class PermissionService {
  private repo = new PermissionRepository();

  async givePermission(taskId: number, email: string, type: PermissionType) {
    const user: User | null = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Utilisateur introuvable");

    return this.repo.givePermission(taskId, user.id, type);
  }
}

import { Permission, PermissionType } from "@prisma/client";
export declare class PermissionRepository {
    private prisma;
    givePermission(taskId: number, userId: number, type: PermissionType): Promise<Permission>;
    findPermissionsByTask(taskId: number): Promise<Permission[]>;
    findUserPermissions(userId: number, taskId: number): Promise<Permission[]>;
}
//# sourceMappingURL=PermissionRepository.d.ts.map
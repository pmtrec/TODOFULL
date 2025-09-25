import { PermissionType } from "@prisma/client";
export declare class PermissionService {
    private repo;
    givePermission(taskId: number, email: string, type: PermissionType): Promise<{
        id: number;
        userId: number;
        taskId: number;
        type: import("@prisma/client").$Enums.PermissionType;
    }>;
}
//# sourceMappingURL=PermissionService.d.ts.map
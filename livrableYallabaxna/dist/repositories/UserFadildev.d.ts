import { User } from "@prisma/client";
export declare class UserFadildev {
    private prisma;
    findById(id: number): Promise<User | null>;
    findByEmail(emailUser: string): Promise<User | null>;
    verifyPassword(user: User, password: string): Promise<boolean>;
    createUser(name: string, email: string, password: string): Promise<User>;
}
//# sourceMappingURL=UserFadildev.d.ts.map
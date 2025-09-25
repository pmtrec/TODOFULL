import { User } from "@prisma/client";
export declare class UserServiceFadilDev {
    private repo;
    constructor();
    findUserById(id: number): Promise<User | null>;
    findByMail(email: string): Promise<User | null>;
    verifyPassword(user: User, password: string): Promise<boolean>;
    createUser(name: string, email: string, password: string): Promise<User>;
}
//# sourceMappingURL=UserServiceFadilDev.d.ts.map
import { User} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../config/database.js";


export class UserFadildev {
    private prisma = prisma;

     async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                taskFadil:true
                
            },
        });
    }

    async findByEmail(emailUser:string): Promise<User|null>{
        return this.prisma.user.findUnique({
            where:{email:emailUser},
            include:{
                taskFadil:true
            }
        })
    }

    async verifyPassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
    
    async createUser(name: string, email: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            include: {
                taskFadil: true,
                permissions: true
            }
        });
    }
}
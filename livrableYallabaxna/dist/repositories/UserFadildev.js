import bcrypt from "bcrypt";
import prisma from "../config/database.js";
export class UserFadildev {
    prisma = prisma;
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                taskFadil: true
            },
        });
    }
    async findByEmail(emailUser) {
        return this.prisma.user.findUnique({
            where: { email: emailUser },
            include: {
                taskFadil: true
            }
        });
    }
    async verifyPassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
    async createUser(name, email, password) {
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
//# sourceMappingURL=UserFadildev.js.map
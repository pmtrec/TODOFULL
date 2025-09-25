import { User } from "@prisma/client";
import {UserFadildev} from "../repositories/UserFadildev.js";

export class UserServiceFadilDev {
    private repo:UserFadildev ; 

    constructor(){
         this.repo = new UserFadildev
    }

    findUserById(id: number): Promise<User | null> {
        return this.repo.findById(id);
    }

    async findByMail(email: string): Promise<User|null>{
        return this.repo.findByEmail(email); 
    }

    async verifyPassword(user: User, password: string): Promise<boolean> {
        return this.repo.verifyPassword(user, password);
    }
    
    async createUser(name: string, email: string, password: string): Promise<User> {
        return this.repo.createUser(name, email, password);
    }
}
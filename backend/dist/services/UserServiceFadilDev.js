import { UserFadildev } from "../repositories/UserFadildev.js";
export class UserServiceFadilDev {
    repo;
    constructor() {
        this.repo = new UserFadildev;
    }
    findUserById(id) {
        return this.repo.findById(id);
    }
    async findByMail(email) {
        return this.repo.findByEmail(email);
    }
    async verifyPassword(user, password) {
        return this.repo.verifyPassword(user, password);
    }
    async createUser(name, email, password) {
        return this.repo.createUser(name, email, password);
    }
}
//# sourceMappingURL=UserServiceFadilDev.js.map
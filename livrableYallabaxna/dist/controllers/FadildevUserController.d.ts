import { Request, Response } from "express";
import { UserServiceFadilDev } from "../services/UserServiceFadilDev.js";
export declare class AuthController {
    private userServiceFadilDev;
    constructor(userServiceFadilDev: UserServiceFadilDev);
    login(req: Request, res: Response): Promise<Response>;
    refresh(req: Request, res: Response): Promise<Response>;
    register(req: Request, res: Response): Promise<Response>;
    me(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=FadildevUserController.d.ts.map
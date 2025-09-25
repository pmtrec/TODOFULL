import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
export declare class FadildevController {
    static getAll(req: AuthRequest, res: Response): Promise<void>;
    static findById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
    static create(req: any, res: Response): Promise<void>;
    static updateImage(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    static update(req: AuthRequest, res: Response): Promise<void>;
    static delete(req: AuthRequest, res: Response): Promise<void>;
    static updateStatus(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=FadildevController.d.ts.map
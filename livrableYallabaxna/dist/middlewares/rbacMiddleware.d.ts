import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";
export declare function authorize(): (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=rbacMiddleware.d.ts.map
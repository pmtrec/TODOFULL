import { JwtPayload } from "jsonwebtoken";
export declare class TokenService {
    static generateToken(payload: object, secret: string, expiresIn: string | number): string;
    static verifyToken<T extends JwtPayload | string>(token: string, secret: string): T;
    static generateAccessToken(payload: object): string;
    static generateRefreshToken(payload: object): string;
    static verifyAccessToken<T extends JwtPayload | string>(token: string): T;
    static verifyRefreshToken<T extends JwtPayload | string>(token: string): T;
}
//# sourceMappingURL=TokenService.d.ts.map
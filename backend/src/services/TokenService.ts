import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshSecret";

export class TokenService {
    static generateToken(payload: object, secret: string, expiresIn: string | number): string {
        const options: SignOptions = { expiresIn: expiresIn as unknown as StringValue | number };
        return jwt.sign(payload, secret, options);
    }

    static verifyToken<T extends JwtPayload | string>(token: string, secret: string): T {
        return jwt.verify(token, secret) as T;
    }

    static generateAccessToken(payload: object): string {
        return this.generateToken(payload, JWT_SECRET, "1h");
    }

    static generateRefreshToken(payload: object): string {
        return this.generateToken(payload, REFRESH_SECRET, "7d");
    }

    static verifyAccessToken<T extends JwtPayload | string>(token: string): T {
        return this.verifyToken<T>(token, JWT_SECRET);
    }

    static verifyRefreshToken<T extends JwtPayload | string>(token: string): T {
        return this.verifyToken<T>(token, REFRESH_SECRET);
    }
}

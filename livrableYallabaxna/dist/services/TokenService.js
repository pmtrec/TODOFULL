import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refreshSecret";
export class TokenService {
    static generateToken(payload, secret, expiresIn) {
        const options = { expiresIn: expiresIn };
        return jwt.sign(payload, secret, options);
    }
    static verifyToken(token, secret) {
        return jwt.verify(token, secret);
    }
    static generateAccessToken(payload) {
        return this.generateToken(payload, JWT_SECRET, "1h");
    }
    static generateRefreshToken(payload) {
        return this.generateToken(payload, REFRESH_SECRET, "7d");
    }
    static verifyAccessToken(token) {
        return this.verifyToken(token, JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        return this.verifyToken(token, REFRESH_SECRET);
    }
}
//# sourceMappingURL=TokenService.js.map
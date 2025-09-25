import { ErreurMessages } from "../utils/errorsMessage.js";
import { StatusCodes } from "../validator/statusCodes.js";
import { TokenService } from "../services/TokenService.js";
export class AuthController {
    userServiceFadilDev;
    constructor(userServiceFadilDev) {
        this.userServiceFadilDev = userServiceFadilDev;
        this.userServiceFadilDev = userServiceFadilDev;
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: ErreurMessages.EmailAndPassword
            });
        }
        const user = await this.userServiceFadilDev.findByMail(email);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: ErreurMessages.IVALID
            });
        }
        const valid = await this.userServiceFadilDev.verifyPassword(user, password);
        if (!valid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: ErreurMessages.IVALID
            });
        }
        // niou essayer utilusr token
        const accessToken = TokenService.generateAccessToken({ userId: user.id });
        const refreshToken = TokenService.generateRefreshToken({ userId: user.id });
        return res.status(StatusCodes.SUCCESS).json({
            code: StatusCodes.SUCCESS,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token: accessToken,
            refreshToken
        });
    }
    async refresh(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: ErreurMessages.NOREFRESHTOKEN
            });
        }
        try {
            const payload = TokenService.verifyRefreshToken(refreshToken);
            const user = await this.userServiceFadilDev.findUserById(payload.userId);
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    code: StatusCodes.UNAUTHORIZED,
                    message: ErreurMessages.USERINVALID
                });
            }
            const accessToken = TokenService.generateAccessToken({ userId: user.id });
            return res.status(StatusCodes.SUCCESS).json({
                code: StatusCodes.SUCCESS,
                accessToken
            });
        }
        catch {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: ErreurMessages.REFRESHTOKENINVALID
            });
        }
    }
    async register(req, res) {
        const { name, email, password } = req.body;
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                message: ErreurMessages.NameEmailPasswordRequired
            });
        }
        try {
            // Check if user already exists
            const existingUser = await this.userServiceFadilDev.findByMail(email);
            if (existingUser) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    code: StatusCodes.BAD_REQUEST,
                    message: "User already exists"
                });
            }
            // Create new user
            const user = await this.userServiceFadilDev.createUser(name, email, password);
            // Generate tokens
            const accessToken = TokenService.generateAccessToken({ userId: user.id });
            const refreshToken = TokenService.generateRefreshToken({ userId: user.id });
            return res.status(StatusCodes.CREATED).json({
                code: StatusCodes.CREATED,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token: accessToken,
                refreshToken
            });
        }
        catch (error) {
            return res.status(StatusCodes.INTERNAL_ERROR).json({
                code: StatusCodes.INTERNAL_ERROR,
                message: "Error creating user"
            });
        }
    }
    async me(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: ErreurMessages.TOKEN_REQUIRED
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: ErreurMessages.TOKEN_REQUIRED
            });
        }
        try {
            const payload = TokenService.verifyAccessToken(token);
            const user = await this.userServiceFadilDev.findUserById(payload.userId);
            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ErreurMessages.USERINVALID
                });
            }
            return res.json({
                id: user.id,
                name: user.name,
                email: user.email
            });
        }
        catch {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: ErreurMessages.TOKEN_INVALID
            });
        }
    }
}
//# sourceMappingURL=FadildevUserController.js.map
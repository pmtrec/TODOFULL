import { StatusCodes } from "../validator/statusCodes.js";
import { ErreurMessages } from "../utils/errorsMessage.js";
// Middleware d'autorisation simplifié : 
// on vérifie seulement que l'utilisateur est bien authentifié.
export function authorize() {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                code: StatusCodes.UNAUTHORIZED,
                message: ErreurMessages.TOKEN_REQUIRED,
            });
        }
        // pas de vérification de rôle, juste passer au suivant
        return next();
    };
}
//# sourceMappingURL=rbacMiddleware.js.map
// import { Request, Response, NextFunction } from "express";
// import { TokenService } from "../services/TokenService.js";
// import { StatusCodes } from "../validator/statusCodes.js";
// import { ErreurMessages } from "../utils/errorsMessage.js";

// // On étend l'objet Request pour y ajouter user
// export interface AuthRequest extends Request {
//   user?: { userId: number };
// }

// export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization;

//   // Vérifier si le token est fourni
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       code: StatusCodes.UNAUTHORIZED,
//       message: ErreurMessages.TOKEN_REQUIRED,
//     });
//   }

//   // Extraire le token
//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       code: StatusCodes.UNAUTHORIZED,
//       message: ErreurMessages.TOKEN_REQUIRED,
//     });
//   }

//   try {
//     // Vérification et décodage du token
//     const payload = TokenService.verifyAccessToken<{ userId: number }>(token);

//     // Attacher le userId à la requête
//     req.user = { userId: payload.userId };

//     return next();
//   } catch (error) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({
//       code: StatusCodes.UNAUTHORIZED,
//       message: ErreurMessages.TOKEN_INVALID,
//     });
//   }
// }

import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/TokenService.js";
import { StatusCodes } from "../validator/statusCodes.js";
import { ErreurMessages } from "../utils/errorsMessage.js";

export interface AuthRequest extends Request {
  user?: { userId: number };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message: ErreurMessages.TOKEN_REQUIRED,
    });
  }

  const token = authHeader.split(" ")[1];

  
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message: ErreurMessages.TOKEN_REQUIRED,
    });
  }

  try {
    const payload = TokenService.verifyAccessToken<{ userId: number }>(token);
    req.user = { userId: payload.userId };
   return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message: ErreurMessages.TOKEN_INVALID,
    });
  }
}

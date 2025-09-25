import { Router } from "express";
// import { PrismaClient } from "@prisma/client";
import { UserServiceFadilDev } from "../services/UserServiceFadilDev.js";
import { AuthController } from "../controllers/FadildevUserController.js";
// const prisma = new PrismaClient();
const userServiceFadilDev = new UserServiceFadilDev();
const authController = new AuthController(userServiceFadilDev);
const router = Router();
router.post("/login", (req, res) => authController.login(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/refresh", (req, res) => authController.refresh(req, res));
router.get("/me", (req, res) => authController.me(req, res));
export default router;
//# sourceMappingURL=AuthUserFadilD.js.map
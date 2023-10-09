import { Router } from "express";

import { AuthController } from "../controllers";
import { loginValidation, registerValidation } from "../validations";

const router = Router();

// SIGN UP or REGISTER
router.post("/register", registerValidation, AuthController.register);

// LOGIN
router.post("/login", loginValidation, AuthController.login);

export { router as AuthRouter };

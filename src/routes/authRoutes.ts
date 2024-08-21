import express from "express";

import validate from "../validators/validate";
import createUserValidation from "../validators/createUserValidation";
import loginUserValidation from "../validators/loginUserValidation";
import authenticateToken from "../middleware/authenticateToken";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/authController";

const router = express.Router();

router.post("/create-user", createUserValidation(), validate, createUser);
router.post("/login", loginUserValidation(), validate, loginUser);
router.delete("/logout", authenticateToken, logoutUser);

export default router;

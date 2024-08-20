import express from "express";

const router = express.Router();

import { createUser, loginUser } from "../controllers/authController";
import validate from "../validators/validate";
import createUserValidation from "../validators/createUserValidation";
import loginUserValidation from "../validators/loginUserValidation";

router.post("/create-user", createUserValidation(), validate, createUser);
router.post("/login", loginUserValidation(), validate, loginUser);

export default router;

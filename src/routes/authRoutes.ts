import express from "express";

const router = express.Router();

import { createUser } from "../controllers/AuthController";
import validate from "../validators/validate";
import createUserValidation from "../validators/createUserValidation";

router.post("/create-user", createUserValidation(), validate, createUser);

export default router;

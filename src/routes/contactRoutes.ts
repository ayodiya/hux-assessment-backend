import express from "express";

const router = express.Router();

import validate from "../validators/validate";
import addContactValidation from "../validators/addContactValidation";
import authenticateToken from "../middleware/authenticateToken";
import { addContact } from "../controllers/contactController";

router.post(
  "/add",
  addContactValidation(),
  validate,
  authenticateToken,
  addContact,
);

export default router;

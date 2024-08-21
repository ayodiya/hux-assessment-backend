import express from "express";

const router = express.Router();

import validate from "../validators/validate";
import addContactValidation from "../validators/addContactValidation";
import authenticateToken from "../middleware/authenticateToken";
import {
  addContact,
  allContacts,
  singleContact,
} from "../controllers/contactController";

router.post(
  "/add",
  addContactValidation(),
  validate,
  authenticateToken,
  addContact,
);
router.get("/all", authenticateToken, allContacts);
router.get("/:slug", authenticateToken, singleContact);

export default router;

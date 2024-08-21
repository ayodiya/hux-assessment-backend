import express from "express";

import validate from "../validators/validate";
import addContactValidation from "../validators/addContactValidation";
import authenticateToken from "../middleware/authenticateToken";
import {
  addContact,
  allContacts,
  singleContact,
  editContact,
  deleteContact,
} from "../controllers/contactController";

const router = express.Router();

router.post(
  "/add",
  addContactValidation(),
  validate,
  authenticateToken,
  addContact,
);
router.get("/all", authenticateToken, allContacts);
router.get("/:slug", authenticateToken, singleContact);
router.patch("/:slug", addContactValidation(), authenticateToken, editContact);
router.delete("/:slug", authenticateToken, deleteContact);

export default router;

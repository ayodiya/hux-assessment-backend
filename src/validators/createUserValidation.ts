import { body } from "express-validator";
const createUserValidation = () => {
  return [
    body("firstName")
      .isLength({ min: 3 })
      .withMessage("must be at least 3 characters long"),
    body("lastName")
      .isLength({ min: 3 })
      .withMessage("must be at least 3 characters long"),
    body("email").isEmail().withMessage("must be a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("must be at least 8 characters long"),
    body("phoneNo")
      .isLength({ min: 11 })
      .withMessage("must be at least 11 characters long")
      .isLength({ max: 11 })
      .withMessage("must not be over 11 characters long"),
  ];
};

export default createUserValidation;

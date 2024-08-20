import { body } from "express-validator";

const loginUserValidation = () => {
  return [
    body("email").isEmail().withMessage("must be a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("must be at least 8 characters long"),
  ];
};

export default loginUserValidation;

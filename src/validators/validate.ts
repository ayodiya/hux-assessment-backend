import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors: Result<ValidationError> = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: { [key: string]: string }[] = [];

  errors.array().map((err) => {
    const error = err as ValidationError & { path: string; msg: string };
    extractedErrors.push({ [error.path]: error.msg });
  });

  res.status(422).json({
    errors: extractedErrors,
  });
};

export default validate;

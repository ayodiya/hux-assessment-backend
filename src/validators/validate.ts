import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors: Result<ValidationError> = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: { [key: string]: string }[] = [];

  errors.array().map((err) => {
    const error = err as ValidationError & { param: string; msg: string };
    extractedErrors.push({ [error.param]: error.msg });
  });

  res.status(422).json({
    errors: extractedErrors,
  });
};

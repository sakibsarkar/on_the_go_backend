import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    const { success, error } = await schema.safeParseAsync(req.body);

    if (success) {
      next();
    } else {
      next(error);
    }
  };
};

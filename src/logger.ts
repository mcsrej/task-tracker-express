import { Request, Response } from 'express';

export const logger = (
  requets: Request,
  response: Response,
  next: () => void,
): void => {
  console.log(`${requets.method} ${requets.originalUrl}`);
  next();
};

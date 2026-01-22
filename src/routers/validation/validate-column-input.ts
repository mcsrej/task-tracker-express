import { Column, CreateColumnRequest } from "../../types/columns";
import { Request, Response } from 'express';

export const validateColumnInput = (
  {body}: Request<unknown, Column, CreateColumnRequest>,
  response: Response,
  next: () => void,
): void => {
    if (typeof body != 'object' || !body.name || typeof body.name !== 'string'){
        response.status(400).send({
            error: 'Validation error',
        })
        return;
    }
  
    next();
};

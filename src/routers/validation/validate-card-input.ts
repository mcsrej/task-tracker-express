import { Card, CreateCardRequest } from "../../types/cards";
import { Request, Response } from 'express';

export const validateCardInput = (
  {body}: Request<unknown, Card, CreateCardRequest>,
  response: Response,
  next: () => void,
): void => {
    if (typeof body != 'object' || !body.text || typeof body.text !== 'string'){
        response.status(400).send({
            error: 'Validation error',
        })
        return;
    }
  
    next();
};

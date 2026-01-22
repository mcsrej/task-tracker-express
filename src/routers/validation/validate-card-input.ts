import { Card, CreateCardRequest } from "../../types/cards";
import { IdParams } from "../../types/common";
import { Request, Response } from 'express';

export const validateCardInput = (
  {body}: Request<IdParams, Card, CreateCardRequest>,
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

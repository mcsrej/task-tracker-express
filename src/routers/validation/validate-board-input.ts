import { Board, CreateBoardRequest } from "../../types/boards";
import { IdParams } from "../../types/common";
import { Request, Response } from 'express';

export const validateBoardInput = (
  {body}: Request<IdParams, Board, CreateBoardRequest>,
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

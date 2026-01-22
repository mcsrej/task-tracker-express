import express, { Response, Request } from 'express';
import { Card, CreateCardRequest, GetCardsResponse } from '../types/cards';
import { IdParams } from '../types/common';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import { randomUUID } from 'crypto';
import { validateCardInput } from './validation/validate-card-input';

export const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  async (request: Request<{}, {}>, response: Response<GetCardsResponse>) => {
    const cards = await getManyCards();
    response.send(cards);
  },
);

cardsRouter.get(
  '/:id',
  async (request: Request<IdParams, {}>, response: Response<Card>) => {
    const card = await getOneCard(request.params.id);

    if (!card) {
      return response.sendStatus(404);
    }
    response.send(card);
  },
);

cardsRouter.post(
  '/',
  validateCardInput,
  async (
    request: Request<{}, Card, CreateCardRequest>,
    response: Response<Card>,
  ) => {
    const card: Card = {
      text: request.body.text,
      id: randomUUID(),
    };

    await createCard(card);
    response.send(card);
  },
);

cardsRouter.put(
  '/:id',
  validateCardInput,
  async (
    request: Request<IdParams, Card, CreateCardRequest>,
    response: Response<Card>,
  ) => {
    const card = {
      id: request.params.id,
      text: request.body.text,
    };

    await updateCard(card);

    response.send(card);
  },
);

cardsRouter.delete(
  '/:id',
  async (request: Request<IdParams>, response: Response<void>) => {
    await deleteCard(request.params.id);
    response.sendStatus(204);
  },
);

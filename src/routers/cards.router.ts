import express, { Response, Request } from 'express';
import { Card, CreateCardRequest, GetCardsResponse } from '../types/cards';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repository';
import { randomUUID } from 'crypto';
import { validateCardInput } from './validation/validate-card-input';
import { CardIdParams, ColumnIdParams } from '../types/common';

export const cardsRouter = express.Router({mergeParams: true});

cardsRouter.get(
  '/',
  async (
    request: Request<ColumnIdParams, {}>,
    response: Response<GetCardsResponse>,
  ) => {
    const cards = await getManyCards(request.params.columnId);
    response.send(cards);
  },
);

cardsRouter.get(
  '/:cardId',
  async (request: Request<CardIdParams, {}>, response: Response<Card>) => {
    const card = await getOneCard(
      request.params.cardId,
      request.params.columnId,
    );

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
    request: Request<ColumnIdParams, Card, CreateCardRequest>,
    response: Response<Card>,
  ) => {
    const card: Card = {
      text: request.body.text,
      id: randomUUID(),
      columnId: request.params.columnId,
    };

    await createCard(card);
    response.send(card);
  },
);

cardsRouter.put(
  '/:cardId',
  validateCardInput,
  async (
    request: Request<CardIdParams, Card, CreateCardRequest>,
    response: Response<Card>,
  ) => {
    const card = {
      id: request.params.cardId,
      text: request.body.text,
      columnId: request.params.columnId,
    };

    await updateCard(card);

    response.send(card);
  },
);

cardsRouter.delete(
  '/:cardId',
  async (request: Request<CardIdParams>, response: Response<void>) => {
    await deleteCard(request.params.cardId, request.params.columnId);
    response.sendStatus(204);
  },
);

import express, { Response, Request } from 'express';
import {
  Card,
  CreateCardRequest,
  GetCardsResponse,
  UpdateCardRequest,
} from '../types/cards';
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
import { checkCardExistence, checkColumnExistence } from './middleware';
import { getOneColumn } from '../database/columns-repository';

export const cardsRouter = express.Router({ mergeParams: true });

cardsRouter.get(
  '/',
  async (
    request: Request<ColumnIdParams, {}>,
    response: Response<GetCardsResponse>,
  ) => {
    const cards = await getManyCards(request.params);
    response.send(cards);
  },
);

cardsRouter.get(
  '/:cardId',
  async (request: Request<CardIdParams, {}>, response: Response<Card>) => {
    const card = await getOneCard(request.params);

    if (!card) {
      return response.sendStatus(404);
    }
    response.send(card);
  },
);

cardsRouter.post(
  '/',
  validateCardInput,
  checkColumnExistence,
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
  checkCardExistence,
  async (
    { body, params }: Request<CardIdParams, Card, UpdateCardRequest>,
    response: Response<Card | string>,
  ) => {
    if (params.columnId !== body.columnId) {
      const column = await getOneColumn(body.columnId, params.boardId);
      if (!column) {
        response.status(404).send('Column not found');
        return;
      }
    }

    const card: Card = {
      id: params.cardId,
      text: body.text,
      columnId: body.columnId,
    };

    await updateCard(card);

    response.send(card);
  },
);

cardsRouter.delete(
  '/:cardId',
  checkCardExistence,
  async (request: Request<CardIdParams>, response: Response<void>) => {
    await deleteCard(request.params.cardId, request.params.columnId);
    response.sendStatus(204);
  },
);

import express, { Response, Request } from 'express';
import {
  Column,
  CreateColumnRequest,
  GetColumnsResponse,
} from '../types/columns';
import { BoardIdParams, ColumnIdParams} from '../types/common';
import {
  createColumn,
  deleteColumn,
  getManyColumns,
  getOneColumn,
  updateColumn,
} from '../database/columns-repository';
import { randomUUID } from 'crypto';
import { validateColumnInput } from './validation/';

export const columnsRouter = express.Router({ mergeParams: true });

columnsRouter.get(
  '/',
  async (
    request: Request<BoardIdParams, {}>,
    response: Response<GetColumnsResponse>,
  ) => {
    const columns = await getManyColumns(request.params.boardId);
    response.send(columns);
  },
);

columnsRouter.get(
  '/:columnId',
  async (request: Request<ColumnIdParams, {}>, response: Response<Column>) => {
    const column = await getOneColumn(
      request.params.columnId,
      request.params.boardId,
    );

    if (!column) {
      return response.sendStatus(404);
    }
    response.send(column);
  },
);

columnsRouter.post(
  '/',
  validateColumnInput,
  async (
    request: Request<BoardIdParams, Column, CreateColumnRequest>,
    response: Response<Column>,
  ) => {
    const column: Column = {
      name: request.body.name,
      id: randomUUID(),
      boardId: request.params.boardId,
    };

    await createColumn(column);
    response.send(column);
  },
);

columnsRouter.put(
  '/:columnId',
  validateColumnInput,
  async (
    request: Request<ColumnIdParams, Column, CreateColumnRequest>,
    response: Response<Column>,
  ) => {
    const column: Column = {
      id: request.params.columnId,
      name: request.body.name,
      boardId: request.params.boardId,
    };

    await updateColumn(column);

    response.send(column);
  },
);

columnsRouter.delete(
  '/:columnId',
  async (request: Request<ColumnIdParams>, response: Response<void>) => {
    await deleteColumn(request.params.columnId, request.params.boardId);
    response.sendStatus(204);
  },
);

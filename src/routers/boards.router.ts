import express, { Response, Request } from 'express';
import { Board, CreateBoardRequest, GetBoardResponse, GetBoardsResponse } from '../types/boards';
import { BoardIdParams } from '../types/common';
import {
  createBoard,
  deleteBoard,
  getManyBoards,
  getOneBoard,
  updateBoard,
} from '../database/boards-repository';
import { randomUUID } from 'crypto';
import { validateBoardInput } from './validation/';

export const boardsRouter = express.Router();

boardsRouter.get(
  '/',
  async (request: Request<{}, {}>, response: Response<GetBoardsResponse>) => {
    const boards = await getManyBoards();
    response.send(boards);
  },
);

boardsRouter.get(
  '/:boardId',
  async (
    request: Request<BoardIdParams, GetBoardResponse | string>,
    response: Response<GetBoardResponse | string>,
  ) => {
    const board = await getOneBoard(request.params.boardId);

    if (!board) {
      return response.sendStatus(404);
    }
    response.send(board);
  },
);

boardsRouter.post(
  '/',
  validateBoardInput,
  async (
    request: Request<{}, Board, CreateBoardRequest>,
    response: Response<Board>,
  ) => {
    const board: Board = {
      name: request.body.name,
      id: randomUUID(),
    };

    await createBoard(board);
    response.send(board);
  },
);

boardsRouter.put(
  '/:boardId',
  validateBoardInput,
  async (
    request: Request<BoardIdParams, Board, CreateBoardRequest>,
    response: Response<Board>,
  ) => {
    const board = {
      id: request.params.boardId,
      name: request.body.name,
    };

    await updateBoard(board);

    response.send(board);
  },
);

boardsRouter.delete(
  '/:boardId',
  async (request: Request<BoardIdParams>, response: Response<void>) => {
    await deleteBoard(request.params.boardId);
    response.sendStatus(204);
  },
);

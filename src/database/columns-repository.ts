import { Column } from '../types/columns';
import { sqliteAll, sqliteGet, sqliteRun } from './db-connection';

export const createColumn = async (column: Column): Promise<void> => {
  await sqliteRun(
    `
        INSERT INTO columns (id, name, board_id)
        VALUES (?,?,?);
        `,
    [column.id, column.name, column.boardId],
  );
};

export const updateColumn = async (column: Column): Promise<void> => {
  await sqliteRun(
    `
        UPDATE columns SET name = ?
        WHERE id = ? AND board_id = ?;
        `,
    [column.name, column.id, column.boardId],
  );
};

export const deleteColumn = async (
  id: string,
  boardId: string,
): Promise<void> => {
  await sqliteRun(
    `
        DELETE FROM columns
        WHERE id = ? AND board_id = ?;
        `,
    [id, boardId],
  );
};

export const getOneColumn = async (
  id: string,
  boardId: string,
): Promise<Column | null> => {
  const data = await sqliteGet(
    `
        SELECT id, name, board_id AS "boardId" FROM columns
        WHERE id = ? AND board_id = ?;
        `,
    [id, boardId],
  );

  if (isColumn(data)) {
    return data;
  }

  return null;
};

export const getManyColumns = async (boardId: string): Promise<Column[]> => {
  const data = await sqliteAll(
    `
        SELECT id, name, board_id AS "boardId" FROM columns
        WHERE board_id = ?;
        `,
    [boardId],
  );

  if (!Array.isArray(data)) {
    console.error(`Unknown data format on getMany: ${data}`);
    throw new Error(`Unknown data format on getMany`);
  }

  return data
    .map((one) => {
      if (isColumn(one)) {
        return one;
      }

      return undefined;
    })
    .filter((one) => one !== undefined);
};

const isColumn = (data: unknown): data is Column => {
  const column = data as Column;
  return Boolean(
    column && typeof column === 'object' && column.id && column.name,
  );
};

import { Card } from '../types/cards';
import { CardIdParams, ColumnIdParams } from '../types/common';
import { sqliteAll, sqliteGet, sqliteRun } from './db-connection';

export const createCard = async (card: Card): Promise<void> => {
  await sqliteRun(
    `
        INSERT INTO cards (id, text, column_id)
        VALUES (?,?,?);
        `,
    [card.id, card.text, card.columnId],
  );
  console.log(card.columnId);
};

export const updateCard = async (card: Card): Promise<void> => {
  await sqliteRun(
    `
        UPDATE cards SET text = ?, column_id = ?
        WHERE id = ?;
        `,
    [card.text, card.columnId, card.id],
  );
};

export const deleteCard = async (
  id: string,
  columnId: string,
): Promise<void> => {
  await sqliteRun(
    `
        DELETE FROM cards
        WHERE id = ? and column_id = ?;
        `,
    [id, columnId],
  );
};

export const getOneCard = async ({
  cardId,
  columnId,
  boardId,
}: CardIdParams): Promise<Card | null> => {
  const data = await sqliteGet(
    `
        SELECT cards.id, cards.text, cards.column_id AS "columnId"
        FROM cards LEFT JOIN columns
        ON cards.column_id = columns.id
        WHERE cards.id = ? AND columns.id = ? AND columns.board_id = ?
        `,
    [cardId, columnId, boardId],
  );

  if (isCard(data)) {
    return data;
  }

  return null;
};

export const getManyCards = async ({
  boardId,
  columnId,
}: ColumnIdParams): Promise<Card[]> => {
  const data = await sqliteAll(
    `
        SELECT cards.id, cards.text, cards.column_id AS "columnId"
        FROM cards LEFT JOIN columns
        ON cards.column_id = columns.id
        WHERE columns.id = ? AND columns.board_id = ?
        `,
    [columnId, boardId],
  );

  if (!Array.isArray(data)) {
    console.error(`Unknown data format on getMany: ${data}`);
    throw new Error(`Unknown data format on getMany`);
  }

  return data
    .map((one) => {
      if (isCard(one)) {
        return one;
      }

      return undefined;
    })
    .filter((one) => one !== undefined);
};

const isCard = (data: unknown): data is Card => {
  const card = data as Card;
  return Boolean(card && typeof card === 'object' && card.id && card.text);
};

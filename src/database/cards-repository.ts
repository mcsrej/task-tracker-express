import { Card } from '../types/cards';
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
        UPDATE cards SET text = ?
        WHERE id = ? AND column_id = ?;
        `,
    [card.text, card.id, card.columnId],
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

export const getOneCard = async (
  id: string,
  columnId: string,
): Promise<Card | null> => {
  const data = await sqliteGet(
    `
        SELECT id, text, column_id AS "columnId" FROM cards
        WHERE id = ? AND column_id = ?;
        `,
    [id, columnId],
  );

  if (isCard(data)) {
    return data;
  }

  return null;
};

export const getManyCards = async (columnId: string): Promise<Card[]> => {
  const data = await sqliteAll(
    `
        SELECT id, text, column_id AS "columnId" FROM cards
        WHERE column_id = ?;
        `,
    [columnId],
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

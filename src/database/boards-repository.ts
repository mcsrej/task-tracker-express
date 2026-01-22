import { Board } from "../types/boards";
import { sqliteAll, sqliteGet, sqliteRun } from "./db-connection";

export const createBoard = async (board: Board): Promise<void> => {
    await sqliteRun(`
        INSERT INTO boards (id, name)
        VALUES (?,?);
        `, [board.id, board.name]);
}

export const updateBoard = async (board: Board): Promise<void> => {
  await sqliteRun(
    `
        UPDATE boards SET name = ?
        WHERE id = ?;
        `,
    [board.name, board.id],
  );
};

export const deleteBoard = async (id: string): Promise<void> => {
  await sqliteRun(
    `
        DELETE FROM boards
        WHERE id = ?;
        `,
    [id],
  );
};


export const getOneBoard = async (id: string): Promise<Board | null> => {
    const data = await sqliteGet(`
        SELECT * FROM boards
        WHERE id = ?;
        `, [id]);
    
    if (isBoard(data)){
        return data;
    }

    return null;
}

export const getManyBoards = async (): Promise<Board[]> => {
    const data = await sqliteAll(
        `
        SELECT * FROM boards
        `,
    );

    if (!Array.isArray(data)){
        console.error(`Unknown data format on getMany: ${data}`);
        throw new Error(`Unknown data format on getMany`);
    }

    return data.map((one) => {
        if (isBoard(one)) {
            return one;
        }

        return undefined;
    }).filter((one) => one !== undefined);
}

const isBoard = (data: unknown): data is Board => {
    const board = data as Board;
    return Boolean(board && typeof board === 'object' && board.id && board.name);
}
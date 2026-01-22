import { sqliteRun } from './db-connection';

export const createTables = async (): Promise<void> => {
  await sqliteRun(`
        CREATE TABLE IF NOT EXISTS boards (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        );
        `);

  await sqliteRun(`
        CREATE TABLE IF NOT EXISTS columns (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            board_id TEXT NOT NULL,
            FOREIGN KEY (board_id) REFERENCES boards(id)
        );
        `);

  await sqliteRun(`
        CREATE TABLE IF NOT EXISTS cards (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            column_id TEXT NOT NULL,
            FOREIGN KEY (column_id) REFERENCES columns(id)
        );
        `);
};

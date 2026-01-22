export type BoardIdParams = {
    boardId: string;
}

export type ColumnIdParams = BoardIdParams & {
    columnId: string;
}

export type CardIdParams = ColumnIdParams & {
    cardId: string;
} 
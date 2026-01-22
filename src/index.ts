import express from 'express';
import { ADMIN_LOGIN, ADMIN_PASSWORD, PORT } from './config';
import { cardsRouter } from './routers/cards.router';
import { createTables } from './database/create-tables';
import basicAuth from 'express-basic-auth';
import { logger } from './logger';
import { boardsRouter } from './routers/boards.router';

async function run() {
  await createTables();

  const server = express();
  server.use(
    basicAuth({
      users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
      challenge: true,
    }),
  );
  server.use(express.json());
  server.use(logger);

  server.get('/', (request, response) => {
    response.send('ok');
  });
  server.use('/boards', boardsRouter);
  server.use('/cards', cardsRouter);

  server.listen(PORT);
}

run().catch((error) => console.error(error));

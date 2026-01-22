import express from 'express';
import { PORT } from './config'
import { cardsRouter } from './routers/cards.router';
const server = express();

server.get('/', (request, response) => {
    response.send('ok');
});

server.use('/cards', cardsRouter);

server.listen(PORT);
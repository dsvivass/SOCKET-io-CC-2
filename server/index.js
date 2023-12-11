import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {} // Para que no se caiga la conexión cuando por algún motivo se pierda
});
// Ahora tenemos todo junto, el servidor de express con todas sus rutas y el servidor de socket.io

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })


    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    })
})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import Message from './model.js';
import { Op } from 'sequelize';

const port = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {} // Para que no se caiga la conexión cuando por algún motivo se pierda
});
// Ahora tenemos todo junto, el servidor de express con todas sus rutas y el servidor de socket.io

io.on('connection', async (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })


    socket.on('chat message', async (msg) => {
        console.log('message: ' + msg);

        try {
            const message = await Message.create({ content: msg })
            io.emit('chat message', msg, message.id);
        } catch (error) {
            console.log(error);
        }

    });

    if (!socket.recovered) { // Si no se recuperó la conexión
        socket.recovered = true;
    
        // Retrieve all messages after the last stored message in the client
        const lastMessageId = socket.handshake.auth.serverOffset;

        const messages = await Message.findAll({
            where: {
                id: {
                    [Op.gt]: lastMessageId
                }
            }
        });

        messages.forEach(message => {
            socket.emit('chat message', message.content, message.id);
        })
    }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
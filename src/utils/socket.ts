import { Server } from 'socket.io';
import App from '../app';

export default class Socket {
    public io: Server;

    public constructor() {
        this.io = new Server(App.server);
    }
}

import { config } from 'dotenv';
config();
import Server from '.';

const server = new Server();

server.listen();
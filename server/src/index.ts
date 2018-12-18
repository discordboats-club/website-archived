import Koa from 'koa';
import { router } from './routers/index';
import { config } from '../config';

const server = new Koa();
const port = process.env.PORT || config.port || 3000;

server.use(router.routes());
server.use(router.allowedMethods());

server.listen(port, () => console.log(`Listing on port ${port}`));
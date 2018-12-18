import Koa from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';
import staticDir from 'koa-static';
import { router } from './routers/index';
import { config } from '../config';

const server = new Koa();
const port = process.env.PORT || config.port || 3000;

server.use(mount('/api', router.routes()));
server.use(mount('/api', router.allowedMethods()));

server.use(staticDir(`${__dirname}/../../../client/dist`));

server.use(async ctx => {
    await send(ctx, 'client/dist/index.html', { root: `${__dirname}/../../../` });
});

server.listen(port, () => console.log(`Listing on port ${port}`));
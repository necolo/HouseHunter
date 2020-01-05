import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import fs from 'fs';

import { Douban } from '../sites/douban';
import { Filter } from '../filter';
import { Db } from '../db';
import path from 'path';

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Expire': '-1',
        'Pragma': 'no-cache',
    });
    fs.createReadStream(path.join(__dirname, '../../index.html')).pipe(ctx.res);
});
router.get('/search', (ctx, next) => {
    ctx.res.setHeader('Access-Control-Allow-Origin', ctx.headers && ctx.headers.origin || '*');
    ctx.res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    ctx.res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    ctx.res.setHeader('Access-Control-Allow-Credentials', 'true');
    try {
        const filterData = JSON.parse(ctx.query.filter);
        const sites = JSON.parse(ctx.query.sites);

        const filter = new Filter();
        filter.text = filterData.text;
        filter.price = filterData.price;

        const inTime = +ctx.query.inTime;

        const resData = {};
        if (sites.indexOf('douban') >= 0) {
            const douban = new Douban(filter);
            douban.run();
            resData['douban'] = Db.read('include', Date.now() - inTime);
        }

        ctx.res.writeHead(200);
        ctx.res.end(JSON.stringify(resData));
    } catch (e) {
        console.log(e);
    }
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(__dirname, '../../build/'))
;

const PORT = 3001;
app.listen(PORT);
console.log(`App is listen on http://localhost:${PORT}`);
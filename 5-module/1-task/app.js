const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

function requestDelay() {
    return new Promise((resolve) => {
        clients.push(resolve);
    })
}
let clients = [];

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await requestDelay();
});

router.post('/publish', async (ctx, next) => {
    if (ctx.request.body.message) {
        clients.forEach(item => {
            item(ctx.request.body.message);
        });
        ctx.status = 200;
        clients = [];
    }
});

app.use(router.routes());


module.exports = app;


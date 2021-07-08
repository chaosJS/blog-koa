const Koa = require('koa');
const app = new Koa();
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} -- ${ctx.url} -- ${rt}`);
});

// X-Response-Time
app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx, next) => {
	ctx.body = 'hello koa';
});
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});
app.listen(9001, () => {
	console.log('test koa in 9001');
});

import * as Koa from 'koa';
import * as views from 'koa-views';
import * as json from 'koa-json';
import * as bodyparser from 'koa-bodyparser';
import * as logger from 'koa-logger';

import IndexRouter from './routes/index';
import UserRouter from './routes/users';

const onerror = require('koa-onerror');
const app = new Koa()

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/../public'))

app.use(views(__dirname + '/../views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date().getTime();
  await next()
  const ms = new Date().getTime() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(IndexRouter.routes()).use(IndexRouter.allowedMethods())
app.use(UserRouter.routes()).use(UserRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa()
const router = new Router()

router.get('/healthz', async ctx => {
  ctx.status = 200
})

app.use(router.routes()).use(router.allowedMethods())

export default app

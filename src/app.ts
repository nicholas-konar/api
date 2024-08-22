
import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import catchHttpErrors from '@middleware/http-errors'
import healthCheckRouter from '@routers/health-check'
import onboardingRouter from '@routers/onboarding'
import groupRouter from '@routers/group'

const app = new Koa()

app.use(bodyParser())
app.use(catchHttpErrors)

app.use(healthCheckRouter.routes()).use(healthCheckRouter.allowedMethods())
app.use(onboardingRouter.routes()).use(onboardingRouter.allowedMethods())
app.use(groupRouter.routes()).use(groupRouter.allowedMethods())

export default app

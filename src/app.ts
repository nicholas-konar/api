
import Koa from 'koa'
import bodyParser from '@koa/bodyparser'
import healthCheckRouter from '@routers/health-check'
import onboardingRouter from '@routers/onboarding'

const app = new Koa()

app.use(bodyParser())

app.use(healthCheckRouter.routes()).use(healthCheckRouter.allowedMethods())
app.use(onboardingRouter.routes()).use(onboardingRouter.allowedMethods())

export default app

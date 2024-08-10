import Router from '@koa/router'
import ctrl from '@controllers/onboarding'
import { enrichContextWithUser } from '@middleware/enrich-context'

const router = new Router({ prefix: '/o' })

router.post('/email', ctrl.verifyEmail)
router.use(enrichContextWithUser).post('/login', ctrl.setLoginCreds)

export default router

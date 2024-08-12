import Router from '@koa/router'
import ctrl from '@controllers/onboarding'

const router = new Router({ prefix: '/o' })

router.post('/email', ctrl.sendVerificationEmail)
router.post('/verify/:token', ctrl.setLoginCreds)

export default router

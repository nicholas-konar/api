import Router from '@koa/router'
import ctrl from '@controllers/onboarding'

const router = new Router({prefix: '/o'})

router.post('/email', ctrl.verifyEmail)
router.post('/login', ctrl.setLoginCreds)

export default router

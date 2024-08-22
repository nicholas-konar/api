import Router from '@koa/router'
import ctrl from '@controllers/group'

const router = new Router({ prefix: '/group' })

router.post('/create', ctrl.create)
router.post('/update', ctrl.update)

export default router

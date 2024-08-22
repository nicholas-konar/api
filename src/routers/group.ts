import Router from '@koa/router'
import ctrl from '@controllers/group'
import { setCtxState } from '@middleware/enrich-context'

const router = new Router({ prefix: '/group' })

router.post('/create', setCtxState(['user']), ctrl.create)
router.post('/update', setCtxState(['user', 'group']), ctrl.update)

export default router

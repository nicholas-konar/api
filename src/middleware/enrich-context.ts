import { Context, Next } from 'koa'
import { User, Group } from '@entity'
import { assert } from '@util'
import {
  BadRequestError,
  GroupNotFoundError,
  UserNotFoundError,
} from '@errors/http-errors'

type Options = 'user' | 'group'
type SetStateFn = (ctx: Context) => void
const fn: Record<Options, SetStateFn> = {
  user: setUserState,
  group: setGroupState,
}

export function setCtxState(opts: Options[]) {
  return async (ctx: Context, next: Next) => {
    await Promise.all(opts.map(k => fn[k](ctx)))
    await next()
  }
}

async function setUserState(ctx: Context) {
  const { userId } = ctx.request.body
  assert(userId, BadRequestError)
  const user = await User.findOneBy({ id: userId })
  assert(user, UserNotFoundError)
  ctx.state.user = user
}

async function setGroupState(ctx: Context) {
  const { groupId } = ctx.request.body
  assert(groupId, BadRequestError)
  const group = await Group.findOneBy({ id: groupId })
  assert(group, GroupNotFoundError)
  ctx.state.group = group
}

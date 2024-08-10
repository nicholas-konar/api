import { AppDataSource } from '@db/data-source'
import { User } from '@db/entity/user'
import { BadRequestError, UserNotFoundError } from '@errors/http-errors'
import { assert } from '@util'
import { Context, Next } from 'koa'

export async function enrichContextWithUser(ctx: Context, next: Next) {
  const { userId } = ctx.request.body
  assert(userId, new BadRequestError)

  const repo = AppDataSource.getRepository(User)
  const user = await repo.findOneBy({ id: userId })
  assert(user, new UserNotFoundError())
  ctx.state.user = user
  await next()
}

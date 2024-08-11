import { HttpError, InternalServerError } from '@errors/http-errors'
import { Context, Next } from 'koa'

export default async function catchHttpErrors(ctx: Context, next: Next) {
  try {
    await next()
  } catch (e: unknown) {
    const err = e instanceof HttpError ? e : new InternalServerError()
    const { message, status } = err
    const name = err.constructor.name
    const error = { name, message, status }
    ctx.status = error.status
    ctx.body = { error }
    // console.error({ error })
  }
}

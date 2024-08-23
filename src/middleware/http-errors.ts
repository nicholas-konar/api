import { HttpError, InternalServerError } from '@errors/http-errors'
import { Context, Next } from 'koa'
import log from '@logger'

export default async function catchHttpErrors(ctx: Context, next: Next) {
  try {
    await next()
  } catch (e: unknown) {
    console.error(e)
    const err = e instanceof HttpError ? e : new InternalServerError()
    const { message, status, stack } = err
    const name = err.constructor.name
    ctx.status = status
    ctx.body = { error: { name, message, status } }
    log.error({ httpError: { name, message, status, stack } })
  }
}

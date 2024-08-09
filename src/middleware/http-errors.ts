import { HttpError, InternalServerError } from '@errors/http-errors'
import { Context, Next } from 'koa'

export default async function catchHttpErrors(ctx: Context, next: Next) {
  try {
    await next()
  } catch (e: unknown) {
    const err = e instanceof HttpError ? e : new InternalServerError()
    const { message, status } = err
    const name = err.constructor.name
    ctx.status = err.status
    ctx.body = { error: { name: err.name, message, status } }
    console.error({ error: { name, message, status } })
  }
}

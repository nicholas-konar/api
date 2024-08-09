import { HttpError, InternalServerError } from '@errors/http-errors'
import { Context, Next } from 'koa'

export default async function catchHttpErrors(ctx: Context, next: Next) {
  try {
    await next()
  } catch (e: unknown) {
    const err = e instanceof HttpError ? e : new InternalServerError()
    const { name, message, status } = err
    ctx.status = err.status
    ctx.body = { error: { name, message, status } }
    console.log({ error: { name, message, status } })
  }
}

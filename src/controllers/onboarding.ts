import { Context } from 'koa'
import { User } from '@entity/user'
import { AppDataSource } from '@db/data-source'
import { InvalidEmailError, UsernameTakenError } from '@errors/http-errors'
import isEmail from 'validator/lib/isEmail'
import { assert } from '@util'

async function verifyEmail(ctx: Context) {
  const { email } = ctx.request.body as { email: string }

  assert(isEmail(email), new InvalidEmailError)

  const repo = AppDataSource.getRepository(User)
  const user = await repo.save({ email })
//   await sendEmail('verifyEmail', email)

  ctx.status = 201
  ctx.body = {
    msg: 'Verification email sent.',
    userId: user.id,
    next: 1,
  }
}

const setLoginCreds = async (ctx: Context) => {
  const { username, password } = ctx.request.body
  const { user } = ctx.state
  const repo = AppDataSource.getRepository(User)

  const taken = await repo.findOneBy({ username })
  assert(!taken, new UsernameTakenError)

  await user.setLoginCredentials(username, password)

  ctx.status = 200
  ctx.body = {
    msg: 'Username and password saved successfully',
    userId: user.id,
    next: 2,
  }
}

export default { verifyEmail, setLoginCreds }

import { Context } from 'koa'
import { User } from '@entity/user'
import {
  InvalidEmailError,
  EmailAlreadyInUseError,
  UsernameTakenError,
  UserNotFoundError,
  ExpiredLinkError,
} from '@errors/http-errors'
import isEmail from 'validator/lib/isEmail'
import { assert } from '@util'
import { savePendingCredential } from '@services/pending-credential'
import { PendingCredential } from '@db/entity/pending-credential'

async function sendVerificationEmail(ctx: Context) {
  const { email } = ctx.request.body as { email: string }

  assert(isEmail(email), InvalidEmailError)

  const taken = await User.findOneBy({ email })
  assert(!taken, EmailAlreadyInUseError)

  await savePendingCredential(email, 'email')
  // send email

  ctx.status = 201
  ctx.body = {
    msg: 'Verification email sent.',
    next: 1,
  }
}

const setLoginCreds = async (ctx: Context) => {
  const { token } = ctx.params
  const { username, password } = ctx.request.body

  const pending = await PendingCredential.findOneBy({ token })
  assert(pending, UserNotFoundError)
  assert(pending.isValid(), ExpiredLinkError)

  const taken = await User.findOneBy({ username })
  assert(!taken, UsernameTakenError)

  const user = new User({ username, email: pending.credential })
  await user.setPassword(password)
  await user.save()

  ctx.status = 200
  ctx.body = {
    msg: 'Username and password saved successfully',
    userId: user.id,
    next: 2,
  }
}

export default { sendVerificationEmail, setLoginCreds }

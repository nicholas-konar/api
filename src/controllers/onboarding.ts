import { Context } from 'koa'
import { User } from '@entity/user'
import {
  InvalidEmailError,
  EmailAlreadyInUseError,
  UsernameTakenError,
  ExpiredLinkError,
  DeadLinkError,
} from '@errors/http-errors'
import isEmail from 'validator/lib/isEmail'
import { assert } from '@util'
import { PendingCredential } from '@db/entity/pending-credential'
import onboarding from '@services/onboarding'

async function sendVerificationEmail(ctx: Context) {
  const { email } = ctx.request.body as { email: string }

  assert(isEmail(email), InvalidEmailError)

  const taken = await User.findOneBy({ email })
  assert(!taken, EmailAlreadyInUseError)

  await onboarding.savePendingCredential(email, 'email')
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

  const pending = await PendingCredential.findOneBy({ token, type: 'email' })
  assert(pending, DeadLinkError)
  assert(pending.isValid(), ExpiredLinkError)

  const taken = await User.findOneBy({ username })
  assert(!taken, UsernameTakenError)

  const user = await onboarding.createShellAccount({
    email: pending.credential,
    emailVerified: true,
    username,
    password,
  })
  await pending.softRemove()

  ctx.status = 200
  ctx.body = {
    msg: 'Account created successfully',
    userId: user.id,
    next: 2,
  }
}

export default { sendVerificationEmail, setLoginCreds }

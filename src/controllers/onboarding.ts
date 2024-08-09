import { Context } from 'koa'
import { User } from '@entity/user'
import { AppDataSource } from '@db/data-source'
import { InvalidEmailError, UsernameTakenError, UserNotFoundError } from '@errors/http-errors'
import isEmail from 'validator/lib/isEmail'

// todo: move to service layer
type EmailTemplate = 'verifyEmail'
const sendEmail = async (template: EmailTemplate, email: string) => {
  console.log(`Mock send ${template} email to ${email}`)
}

async function verifyEmail(ctx: Context) {
  const { email } = ctx.request.body as { email: string }

  if (!(email && isEmail(email))) {
    throw new InvalidEmailError()
  }

  const repo = AppDataSource.getRepository(User)
  const user = await repo.save({ email })
  await sendEmail('verifyEmail', email)

  ctx.status = 201
  ctx.body = {
    msg: 'Verification email sent.',
    userId: user.id,
    next: 1,
  }
}

const setLoginCreds = async (ctx: Context) => {
  const { userId, username, password } = ctx.request.body
  const repo = AppDataSource.getRepository(User)

  const taken = await repo.findOneBy({ username })
  if (taken) throw new UsernameTakenError()

  const user = await repo.findOneBy({ id: userId })
  if (!user) throw new UserNotFoundError()
    
  await user.setLoginCredentials(username, password)

  ctx.status = 200
  ctx.body = {
    msg: 'Username and password saved successfully',
    userId: user.id,
    next: 2,
  }
}

export default { verifyEmail, setLoginCreds }

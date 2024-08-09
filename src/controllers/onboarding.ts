import { Context } from 'koa'
import { User } from '@entity/user'
import { AppDataSource } from '@db/data-source'
import { InvalidEmailError } from '@errors/http-errors'
import isEmail from 'validator/lib/isEmail'

const createShellAccount = async (email: string) => {
  const userRepository = AppDataSource.getRepository(User)
  return userRepository.save({ email })
}

type EmailTemplate = 'verifyEmail'
const sendEmail = async (template: EmailTemplate, email: string) => {
  console.log(`Mock send ${template} email to ${email}`)
}
async function verifyEmail(ctx: Context) {
  const { email } = ctx.request.body as { email: string }

  if (!(email && isEmail(email))) {
    throw new InvalidEmailError()
  }

  const user = await createShellAccount(email)
  await sendEmail('verifyEmail', email)
  ctx.status = 201
  ctx.body = {
    message: 'User onboarded successfully.',
    userId: user.id,
    next: 1,
  }
}

const setLoginCreds = async (ctx: Context) => {
  ctx.status = 500
}

export default { verifyEmail, setLoginCreds }

import crypto from 'crypto'
import { User } from '@entity/user'

export const fakeUser = async (opts: Partial<User> = {}): Promise<User> => {
  const user = new User(opts)
  const random = crypto.randomBytes(4).toString('hex')
  user.email ||= `${random}@example.com`
  user.username ||= 'test_user'
  await user.setPassword(opts.password || 'password')
  return user.save()
}

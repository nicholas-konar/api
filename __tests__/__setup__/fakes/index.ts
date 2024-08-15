import crypto from 'crypto'
import { User } from '@entity/user'
import { Group } from '@db/entity/group'

export const fakeUser = async (opts: Partial<User> = {}): Promise<User> => {
  const user = new User(opts)
  const random = crypto.randomBytes(4).toString('hex')
  user.email ||= `${random}@example.com`
  user.username ||= `user_${random}`
  await user.setPassword(opts.password || 'password')
  return user.save()
}

export const fakeGroup = (user: User): Promise<Group> => {
  const group = new Group()
  group.name = `${user.username}'s group`
  return group.save()
}

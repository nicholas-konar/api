import { User } from '@entity/user'

export const fakeUser = async (opts: Partial<User> = {}): Promise<User> => {
  return new User(opts).save()
}

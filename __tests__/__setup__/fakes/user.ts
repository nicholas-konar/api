import { User } from '@db/entity/user'

export const fakeUser = async (opts: Partial<User> = {}): Promise<User> => {
        const user = new User()
        return user.update(opts)
}

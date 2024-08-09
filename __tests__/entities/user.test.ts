import { AppDataSource } from '@db/data-source'
import { Repository } from 'typeorm'
import { User } from '@entity/user'

let repo: Repository<User>
beforeAll(async () => {
  repo = AppDataSource.getRepository(User)
})

afterEach(async () => {
  await repo.clear()
})

it('create user', async () => {
  const email = `foo@bar.com`
  const user: User = await User.createShellAccount({ email })
  expect(user.id).toBeTruthy()
  expect(user.email).toBe(email)
})

it('set username and password', async () => {
  const email = 'foo@bar.com'
  const username = 'foo'
  const password = 'bar'
  const user = new User({ email })
  await user.setUsername(username)
  await user.setPassword(password)
  const valid = await user.verifyPassword(password)
  expect(user.username).toBe(username)
  expect(user.password).toBeTruthy()
  expect(user.password).not.toBe(password)
  expect(valid).toBe(true)
})

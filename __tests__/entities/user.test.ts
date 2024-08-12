import { User } from '@entity/user'

beforeEach(async () => {
  await User.clear()
})

it('create user', async () => {
  const email = 'foo@bar.com'
  const username = 'foo'
  const password = 'bar'
  const user = new User()
  await user.setEmailOrFail(email)
  await user.setUsernameOrFail(username)
  await user.setPassword(password)
  await user.save()
  const valid = await user.verifyPassword(password)
  expect(user.username).toBe(username)
  expect(user.password).toBeTruthy()
  expect(user.password).not.toBe(password)
  expect(valid).toBe(true)
})

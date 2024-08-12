import request from 'supertest'
import { runServer, stopServer } from '@setup'
import { User } from '@entity/user'
import { fakeUser } from '@fakes/user'
import { PendingCredential } from '@db/entity/pending-credential'
import onboarding from '@services/onboarding'

let server: any
beforeAll(async () => {
  server = await runServer()
})

afterAll(async () => {
  await stopServer()
})

beforeEach(async () => {
  await User.clear()
  await PendingCredential.clear()
})

describe('onboarding steps', () => {
  it('collect email', async () => {
    const step = 0
    const email = 'foo@bar.com'
    const res = await request(server)
      .post('/o/email')
      .send({ email })
      .expect(201)
    const { next } = res.body
    const [pending, count] = await PendingCredential.findAndCount({
      where: { credential: email },
    })
    expect(next).toBe(step + 1)
    expect(pending[0].credential).toBe(email)
    expect(count).toBe(1)
  })

  it('422 on email already in use', async () => {
    const user = await fakeUser()
    await request(server)
      .post('/o/email')
      .send({ email: user.email })
      .expect(422)
  })

  it('422 on no email', async () => {
    await request(server).post('/o/email').send({ email: '' }).expect(422)
  })

  it('422 on bad email', async () => {
    await request(server).post('/o/email').send({ email: 'foo' }).expect(422)
  })
})

describe('set login credentials', () => {
  it('collect username and password', async () => {
    const step = 1
    const email = 'foo@bar.com'
    const username = 'foo'
    const password = 'bar'
    const { token } = await onboarding.savePendingCredential(email, 'email')
    const res = await request(server)
      .post(`/o/verify/${token}`)
      .send({
        username,
        password,
      })
      .expect(200)
    const { userId, next } = res.body
    const user = await User.findOneBy({ id: userId })
    const valid = await user.verifyPassword(password)
    expect(user.email).toBe(email)
    expect(user.username).toBe(username)
    expect(user.password).toBeTruthy()
    expect(valid).toBe(true)
    expect(next).toBe(step + 1)
  })

  it('username taken', async () => {
    const email = 'foo@bar.com'
    const username = 'foo'
    const password = 'bar'
    const user = await fakeUser({ username })
    const { token } = await onboarding.savePendingCredential(email, 'email')
    await request(server)
      .post(`/o/verify/${token}`)
      .send({
        userId: user.id,
        username,
        password,
      })
      .expect(422)
  })
})

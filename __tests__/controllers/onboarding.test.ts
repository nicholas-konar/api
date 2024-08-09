import { runServer, stopServer } from '@setup'
import { AppDataSource } from '@db/data-source'
import { Repository } from 'typeorm'
import { User } from '@entity/user'
import request from 'supertest'
import { fakeUser } from '@fakes/user'

let server: any, repo: Repository<User>
beforeAll(async () => {
  repo = AppDataSource.getRepository(User)
  server = await runServer()
})

afterAll(async () => {
  await stopServer()
})

afterEach(async () => {
  await repo.clear()
})

describe('onboarding steps', () => {
  it('collect email', async () => {
    const step = 0
    const email = 'foo@bar.com'
    const res = await request(server)
      .post('/o/email')
      .send({ email })
      .expect(201)
    const { userId, next } = res.body
    const user = await repo.findOneBy({ id: userId })
    expect(user.id).toBe(userId)
    expect(user.email).toBe(email)
    expect(user.emailVerified).toBe(false)
    expect(next).toBe(step + 1)
  })

  it('422 on no email', async () => {
    await request(server).post('/o/email').send({ email: '' }).expect(422)
  })

  it('422 on bad email', async () => {
    await request(server).post('/o/email').send({ email: 'foo' }).expect(422)
  })

  it('collect username and password', async () => {
    const step = 1
    const email = 'foo@bar.com'
    const username = 'foo'
    const password = 'bar'
    const user = await fakeUser({ email })
    const res = await request(server)
      .post('/o/login')
      .send({
        userId: user.id,
        username,
        password,
      })
      .expect(200)
    const { userId, next } = res.body
    await user.reload()
    const valid = await user.verifyPassword(password)
    expect(user.id).toBe(userId)
    expect(user.username).toBe(username)
    expect(user.password).toBeTruthy()
    expect(valid).toBe(true)
    expect(next).toBe(step + 1)
  })

  it('username taken', async () => {
    const email = 'foo@bar.com'
    const username = 'foo'
    const password = 'bar'
    const user = await fakeUser({ email, username })
    await request(server)
      .post('/o/login')
      .send({
        userId: user.id,
        username,
        password,
      })
      .expect(422)
  })
})

import { runServer, stopServer } from '@setup'
import { AppDataSource } from '@db/data-source'
import { Repository } from 'typeorm'
import { User } from '@entity/user'
import request from 'supertest'

let server: any, repo: Repository<User>
beforeAll(async () => {
  repo = AppDataSource.getRepository(User)
  server = await runServer()
})

afterAll(async () => {
  await repo.clear()
  await stopServer()
})

describe('onboarding steps', () => {
  it('collect email', async () => {
    const email = 'foo@bar.com'
    const step = 0
    const res = await request(server)
      .post('/o/email')
      .send({ email })
      .expect(201)
    expect(res.body.userId).toBeTruthy()
    expect(res.body.next).toBe(step + 1)
  })

  it('400 on no email', async () => {
    await request(server).post('/o/email').send({ email: '' }).expect(422)
  })

  it('400 on bad email', async () => {
    await request(server).post('/o/email').send({ email: 'foo' }).expect(422)
  })
})

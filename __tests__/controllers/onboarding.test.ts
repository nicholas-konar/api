import { runServer, stopServer } from '@setup'
import request from 'supertest'

let server: any
beforeAll(async () => {
  server = await runServer()
})

afterAll(async () => {
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
    await request(server).post('/o/email').send({ email: '' }).expect(400)
  })

  it('400 on bad email', async () => {
    await request(server).post('/o/email').send({ email: 'foo' }).expect(400)
  })
})

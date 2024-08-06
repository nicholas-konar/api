import { runServer, stopServer } from '@setup'
import request from 'supertest'

let server: any
beforeAll(async () => {
  server = await runServer()
})

afterAll(async () => {
  await stopServer()
})

it('healthcheck', async () => {
  await request(server).get('/healthz').expect(200)
})

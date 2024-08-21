import request from 'supertest'
import { runServer, stopServer, truncateTables } from '@setup'
import { User } from '@entity/user'
import { fakeUser } from '@fakes'
import { PendingCredential } from '@db/entity/pending-credential'
import onboarding from '@services/onboarding'
import crypto from 'crypto'

let server: any
beforeAll(async () => {
  server = await runServer()
})

afterAll(async () => {
  await stopServer()
})

beforeEach(async () => {
  await truncateTables([User, PendingCredential])
})

describe('group', () => {
  it('create group', async () => {
    const user = await fakeUser()
    const groupName = 'New Group'
    const res = await request(server)
      .post(`/group/create`)
      .send({
    userId: user.id,
        groupName,
      })
      .expect(200)
    const { userId } = res.body
  })

//   it('username taken', async () => {
//     const email = 'foo@bar.com'
//     const username = 'foo'
//     const password = 'bar'
//     const user = await fakeUser({ username })
//     const { token } = await onboarding.savePendingCredential(email, 'email')
//     await request(server)
//       .post(`/o/verify/${token}`)
//       .send({
//         userId: user.id,
//         username,
//         password,
//       })
//       .expect(422)
//   })
})

import request from 'supertest'
import { runServer, stopServer, truncateTables } from '@setup'
import { User, Group, GroupUserPermission, PendingCredential } from '@entity'
import { fakeUser } from '@fakes'
import { Permission } from '@db/entity/group-user-permissions'

let server: any
beforeAll(async () => {
  server = await runServer()
})

afterAll(async () => {
  await stopServer()
})

beforeEach(async () => {
  await truncateTables([User, PendingCredential, Group, GroupUserPermission])
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
      .expect(201)
    const { groupId } = res.body

    const g = await Group.findOne({
      where: { id: groupId },
      relations: ['owner'],
    })
    expect(g.name).toBe(groupName)
    expect(g.owner.id).toBe(user.id)

    // Check GroupUserPermissions
    const arr = await GroupUserPermission.find({
      where: { userId: user.id, groupId: g.id },
      relations: ['user', 'group'],
    })
    const p = arr.find(p => p.name === Permission.ADMIN)
    expect(p.user.id).toBe(user.id)
    expect(p.group.id).toBe(g.id)
  })
})

import request from 'supertest'
import { runServer, stopServer, truncateTables } from '@setup'
import { User, Group, GroupUserPermission, PendingCredential } from '@entity'
import { fakeGroup, fakeUser } from '@fakes'
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

    const arr = await GroupUserPermission.find({
      where: { userId: user.id, groupId: g.id },
      relations: ['user', 'group'],
    })
    const p = arr.find(p => p.name === Permission.ADMIN)
    expect(p.user.id).toBe(user.id)
    expect(p.group.id).toBe(g.id)
    expect(arr.some(e => e.name === Permission.ADMIN)).toBe(true)
  })

  it('update group', async () => {
    const user = await fakeUser()
    const group = await fakeGroup(user)
    const res = await request(server)
      .post(`/group/update`)
      .send({
        userId: user.id,
        groupId: group.id,
        name: 'New Name',
        description: 'New Description',
      })
      .expect(200)
    const { groupId } = res.body

    const g = await Group.findOne({
      where: { id: groupId },
    })
    expect(g.name).toBe('New Name')
    expect(g.description).toBe('New Description')
  })
})

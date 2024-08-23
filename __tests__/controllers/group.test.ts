import request from 'supertest'
import { runServer, stopServer, truncateTables } from '@setup'
import { User, Group, GroupUserPermission, PendingCredential } from '@entity'
import { fakeGroup, fakeUser } from '@fakes'

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
      where: { userId: user.id, groupId: g.id, feature: 'admin' },
      relations: ['user', 'group'],
    })
    const p = arr.find(p => p.feature === 'admin')
    expect(p.user.id).toBe(user.id)
    expect(p.group.id).toBe(g.id)
    expect(arr.some(e => e.feature === 'admin')).toBe(true)
  })

  it('update group', async () => {
    const user = await fakeUser()
    const group = await fakeGroup(user)
    await new GroupUserPermission({
      userId: user.id,
      groupId: group.id,
      feature: 'admin',
    }).save()
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

  it('does not update without permission', async () => {
    const user = await fakeUser()
    const group = await fakeGroup(user, { name: 'Original name' })
    await request(server)
      .post(`/group/update`)
      .send({
        userId: user.id,
        groupId: group.id,
        name: 'New Name',
        description: 'New Description',
      })
      .expect(403)
    const g = await Group.findOne({
      where: { id: group.id },
    })
    expect(g.name).toBe('Original name')
  })
})

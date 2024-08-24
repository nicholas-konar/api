import { Group, User, GroupUserPermission } from '@entity'
import { fakeGroup, fakeUser } from '@setup/fakes'
import { truncateTables } from '@setup'

beforeEach(async () => {
  await truncateTables([User, Group, GroupUserPermission])
})

describe('group user permissions', () => {
  it('creates perms', async () => {
    const user = await fakeUser()
    const group = await fakeGroup(user)
    const perm = await new GroupUserPermission({
      group,
      user,
      feature: 'admin',
    }).save()
    expect(await GroupUserPermission.countBy({ id: perm.id })).toBe(1)
    expect(perm.userId).toBe(user.id)
    expect(perm.groupId).toBe(group.id)
    expect(perm.feature).toBe('admin')
  })

  it('cascade when group is deleted', async () => {
    const user = await fakeUser()
    const group = await fakeGroup(user)
    await new GroupUserPermission({
      group,
      user,
      feature: 'admin',
    }).save()
    const before = await GroupUserPermission.countBy({ groupId: group.id })
    await Group.remove(group)
    const after = await GroupUserPermission.countBy({ groupId: group.id })
    expect(before).toBe(1)
    expect(after).toBe(0)
  })

  it('cascade when user is deleted', async () => {
    const owner = await fakeUser()
    const group = await fakeGroup(owner)
    const user = await fakeUser()
    await new GroupUserPermission({
      group,
      user,
      feature: 'admin',
    }).save()
    const before = await GroupUserPermission.countBy({ groupId: group.id })
    await User.remove(user)
    const after = await GroupUserPermission.countBy({ groupId: group.id })
    expect(before).toBe(1)
    expect(after).toBe(0)
  })
})

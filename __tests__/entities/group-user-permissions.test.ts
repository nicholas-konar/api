import { GroupUserPermissions, Permission } from '@db/entity/group-user-permissions'
import { User } from '@db/entity/user'
import { Group } from '@entity/group'
import { fakeGroup, fakeUser } from '@setup/fakes'
import { truncateTables } from '@setup'

beforeEach(async () => {
  await truncateTables([User, Group, GroupUserPermissions])
})

describe('group user permissions', () => {
  it('creates perms', async () => {
    const user = await fakeUser()
    const group = await fakeGroup(user)
    const perm = new GroupUserPermissions()
    perm.groupId = group.id
    perm.userId = user.id
    perm.name = Permission.ADMIN
    await perm.save()
    expect(perm.id).toBeTruthy()
  })

})

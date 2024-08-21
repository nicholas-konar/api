import { User } from '@db/entity/user'
import { Group } from '@entity/group'
import { fakeUser } from '@setup/fakes'
import { truncateTables } from '@setup'
import { v4 as uuid } from 'uuid'

beforeEach(async () => {
  await truncateTables([User, Group])
})

describe('Group', () => {
  it('create group', async () => {
    const user = await fakeUser()
    await new Group({
      name: `${user.username}'s group`,
      description: 'test description',
      owner: user,
    }).save()
    const group = await Group.findOne({
      where: { ownerId: user.id },
      relations: ['owner'],
    })
    expect(group.id).toBeTruthy()
    expect(group.ownerId).toBe(user.id)
    expect(group.owner.id).toBe(user.id)
  })

  it('ownerId required', async () => {
    const group = new Group({
      name: 'test group',
    })
    await expect(group.save()).rejects.toThrow()
    expect(await Group.findOne({ where: { name: group.name } })).toBeNull()
  })

  it('owner exists', async () => {
    const group = new Group({
      name: 'test group',
      ownerId: uuid(),
    })
    await expect(group.save()).rejects.toThrow()
    expect(await Group.findOne({ where: { name: group.name } })).toBeNull()
  })

  it('unique name', async () => {
    const user = await fakeUser()
    const group1 = await new Group({
      name: 'test group',
      description: 'group 1',
      owner: user,
    }).save()
    const group2 = new Group({
      name: group1.name,
      description: 'group 2',
      owner: user,
    })
    await expect(group2.save()).rejects.toThrow()
    expect(
      await Group.count({
        where: { name: group1.name },
      })
    ).toBe(1)
  })
})

import { User } from '@db/entity/user'
import { Group } from '@entity/group'
import { fakeUser } from '@setup/fakes'
import { truncateTables } from '@setup'

beforeEach(async () => {
  await truncateTables([User, Group])
})

it('create group', async () => {
  const user = await fakeUser()
  const group = new Group()
  group.name = `${user.username}'s group`
  await group.save()
  expect(group.id).toBeTruthy()
})

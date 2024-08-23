import { AppDataSource } from '@db/data-source'
import { User, Group } from '@entity'
import { GroupUserPermission } from '@db/entity/group-user-permissions'
import { AccessDeniedError, GroupNameTakenError } from '@errors/http-errors'
import { assert } from '@util'
import { Context } from 'koa'
import { EntityManager } from 'typeorm'
import _ from 'lodash'

async function create(ctx: Context) {
  const { groupName } = ctx.request.body
  const { user } = ctx.state
  const groupNameTaken = await Group.findOneBy({ name: groupName })
  assert(!groupNameTaken, GroupNameTakenError)

  const group = new Group({ name: groupName, owner: user })
  await AppDataSource.transaction(async (db: EntityManager) => {
    await db.save(group)
    await db.save(
      new GroupUserPermission({
        userId: user.id,
        groupId: group.id,
        feature: 'admin',
      })
    )
  })

  ctx.status = 201
  ctx.body = {
    userId: user.id,
    groupId: group.id,
  }
}

async function update(ctx: Context) {
  const data = ctx.request.body
  const { user, group } = ctx.state as { user: User; group: Group }

  assert(
    await GroupUserPermission.findOneBy({
      userId: user.id,
      groupId: group.id,
      feature: 'admin',
    }),
    AccessDeniedError
  )

  const props = _.pick(data, Group.updateableFields)
  await group.update(props)

  ctx.status = 200
  ctx.body = {
    userId: user.id,
    groupId: group.id,
  }
}

export default { create, update }

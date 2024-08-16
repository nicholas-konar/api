import { AppDataSource } from '@db/data-source'
import { EntityTarget, BaseEntity } from 'typeorm'

async function truncateTables(entities: EntityTarget<BaseEntity>[]) {
  await AppDataSource.transaction(async sql => {
    Promise.all([
      sql.query('SET CONSTRAINTS ALL DEFERRED'),
      ...entities.map(e => {
        const metadata = AppDataSource.getMetadata(e)
        sql.query(`TRUNCATE TABLE "${metadata.tableName}" CASCADE`)
      }),
    ])
  })
}

export { truncateTables }

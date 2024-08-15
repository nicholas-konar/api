import { AppDataSource } from '@db/data-source'
import { EntityTarget, BaseEntity } from 'typeorm'

async function truncateTables(entities: EntityTarget<BaseEntity>[]) {
  AppDataSource.transaction(async sql => {
    const queries = entities.map(e => {
      const metadata = AppDataSource.getMetadata(e)
      return sql.query(`TRUNCATE TABLE "${metadata.tableName}" CASCADE`)
    })
    Promise.all([sql.query('SET CONSTRAINTS ALL DEFERRED'), ...queries])
  })
}

export { truncateTables }

import 'dotenv/config'
import log from '@logger'
import crypto from 'crypto'
import { PendingCredential } from '@entity/pending-credential'
import { CredentialType } from '@types'

export async function savePendingCredential(
  credential: string,
  type: CredentialType
): Promise<PendingCredential> {
  const random = crypto.randomBytes(4).toString('hex')
  const expiry = parseFloat(process.env.EXPIRY_TIME)
  const pending = new PendingCredential({
    token: random,
    credential,
    type,
    expiry,
  })
  await pending.save()
  log.info({ msg: 'Pending credential saved', credentialId: pending.id })
  return pending
}

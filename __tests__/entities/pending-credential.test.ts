import { PendingCredential } from '@db/entity/pending-credential'
import crypto from 'crypto'

describe('PendingCredential', () => {
  it('create', async () => {
    const random = crypto.randomBytes(4).toString('hex')
    const email = 'foo@bar.com'
    const pending = new PendingCredential({
      token: random,
      credential: email,
      type: 'email',
    })
    await pending.save()
    const cred = await PendingCredential.findOneByOrFail({id: pending.id})
    expect(pending.id).toBe(cred.id)
  })
})

import { PendingCredential } from '@db/entity/pending-credential'
import crypto from 'crypto'

describe('PendingCredential', () => {
  it('create', async () => {
    const random = crypto.randomBytes(4).toString('hex')
    const pending = new PendingCredential({
      token: random,
      credential: 'foo@bar.com',
      type: 'email',
      expiry: 900_000,
    })
    await pending.save()
    const cred = await PendingCredential.findOneByOrFail({ id: pending.id })
    expect(pending.id).toBe(cred.id)
  })

  it('is expired', async () => {
    const random = crypto.randomBytes(4).toString('hex')
    const pending = new PendingCredential({
      token: random,
      credential: 'foo@bar.com',
      type: 'email',
      expiry: -1,
    })
    await pending.save()
    expect(pending.isValid()).toBe(false)
  })

  it('is not expired', async () => {
    const random = crypto.randomBytes(4).toString('hex')
    const pending = new PendingCredential({
      token: random,
      credential: 'foo@bar.com',
      type: 'email',
      expiry: 900000,
    })
    await pending.save()
    expect(pending.isValid()).toBe(true)
  })
})

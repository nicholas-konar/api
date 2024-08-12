import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum CredentialType {
  email = 'email',
  phone = 'phone',
  btcAddress = 'btc_address',
}

@Entity()
export class PendingCredential extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  token: string

  @Column()
  credential: string

  @Column({ type: 'enum', enum: CredentialType })
  type: keyof typeof CredentialType

  @CreateDateColumn()
  createdAt: number

  constructor(data?: Partial<PendingCredential>) {
    super()
    Object.assign(this, data)
  }
}

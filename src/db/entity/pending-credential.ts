import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

enum CredentialType {
  email = 'email',
  phone = 'phone',
  btcAddress = 'btc_address',
}

@Entity()
export class PendingCredential extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ unique: true })
  token: string

  @Column()
  credential: string

  @Column({ type: 'enum', enum: CredentialType })
  type: keyof typeof CredentialType

  @Column()
  expiry: number

  @CreateDateColumn()
  createdAt: Date

  constructor(data?: Partial<PendingCredential>) {
    super()
    Object.assign(this, data)
  }

  isValid = () => this.createdAt.getTime() + this.expiry > Date.now()
}

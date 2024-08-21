import {
  Entity,
  BaseEntity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Group } from './group'
import { User } from './user'

export enum Permission {
  ADMIN = 'admin',
  MOD = 'moderator',
  NOTARY = 'notary',
  BUY = 'buy',
  SELL = 'sell',
}

@Entity()
export class GroupUserPermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Group, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'groupId' })
  group: Group

  @Column()
  userId: string

  @Column()
  groupId: string

  @Column({ type: 'enum', enum: Permission })
  name: Permission

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  constructor(data?: Partial<GroupUserPermission>) {
    super()
    Object.assign(this, data)
  }
}

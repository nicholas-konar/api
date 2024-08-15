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
export class GroupUserPermissions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @ManyToOne(() => User)
  @JoinColumn()
  userId: string

  @ManyToOne(() => Group)
  @JoinColumn()
  groupId: string

  @Column({type: 'enum', enum: Permission})
  name: Permission

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}

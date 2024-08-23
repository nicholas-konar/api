import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Group } from './group'
import { User } from './user'

enum PermissionEnum {
  admin = 'admin',
  moderator = 'moderator',
  notary = 'notary',
  buy = 'buy',
  sell = 'sell',
}

type Permission = keyof typeof PermissionEnum

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

  @Column({ type: 'enum', enum: PermissionEnum, nullable: false })
  feature: Permission

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

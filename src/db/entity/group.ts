import {
  BaseEntity,
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Length } from 'class-validator'
import { User } from './user'
import { GroupUserPermission } from './group-user-permissions'

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User

  @Column()
  ownerId: string


  @OneToMany(() => GroupUserPermission, permission => permission.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  permissions: GroupUserPermission[]

  @Length(3, 20)
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  constructor(data?: Partial<Group>) {
    super()
    Object.assign(this, data)
  }
}

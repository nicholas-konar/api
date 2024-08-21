import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { Length } from 'class-validator'
import { User } from './user'

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Length(3, 20)
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User

  @Column()
  ownerId: string

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

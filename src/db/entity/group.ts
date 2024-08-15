import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm'
import { Length } from 'class-validator'

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Length(3, 20)
  @Column({ unique: true })
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  url: string

  @Column({ default: false })
  requestToJoin: boolean

  @Column({ nullable: true })
  requestToJoinPrompt: string

  @Column({ nullable: true })
  city: string

  @Column({ nullable: true })
  state: string

  @JoinColumn()
  createdBy: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}

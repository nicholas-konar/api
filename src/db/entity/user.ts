import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'
import { IsEmail, Length } from 'class-validator'
import argon2 from 'argon2'
import { assert } from '@util'
import { EmailAlreadyInUseError, UsernameTakenError } from '@errors/http-errors'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Length(3, 20)
  @Column({ unique: true })
  username: string

  @Length(8, 100)
  @Column()
  password: string

  @IsEmail()
  @Column()
  email: string

  @Column({ default: false })
  emailVerified!: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  constructor(data?: Partial<User>) {
    super()
    Object.assign(this, data)
  }

  public async setEmailOrFail(email: string, verified: boolean = false) {
    const emailTaken = await User.findOneBy({ email })
    assert(!emailTaken, EmailAlreadyInUseError)
    this.email = email
    this.emailVerified = verified
  }

  public async setUsernameOrFail(username: string) {
    const usernameTaken = await User.findOneBy({ username })
    assert(!usernameTaken, UsernameTakenError)
    this.username = username
  }

  public async setPassword(password: string) {
    // todo: move config to dedicated module
    const hash = await argon2.hash(password, {
      type: 2, // argon2id
      memoryCost: 2 ** 16, // 64 MiB
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
    })
    this.password = hash
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password)
  }

  public async update(data: Partial<User>): Promise<this> {
    Object.assign(this, data)
    return this.save()
  }
}

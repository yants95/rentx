import { IUserRepository } from '@/modules/accounts/repositories'
import { User } from '@/modules/accounts/infra/typeorm/entities'
import { ICreateUserDTO } from '@/modules/accounts/dtos'

import { getRepository, Repository } from 'typeorm'

export class UserRepository implements IUserRepository {
  private readonly repository: Repository<User>

  constructor () {
    this.repository = getRepository(User)
  }

  async create (data: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name: data.name,
      email: data.email,
      driver_license: data.driver_license,
      password: data.password,
      avatar: data.avatar,
      id: data.id
    })

    return await this.repository.save(user)
  }

  async findByEmail (email: string): Promise<User> {
    return await this.repository.findOne({ email })
  }

  async findById (id: string): Promise<User> {
    return await this.repository.findOne(id)
  }
}

import { IUserRepository, IUserTokenRepository } from '@/modules/accounts/repositories'
import { AppError } from '@/shared/errors'
import { IDateProvider } from '@/shared/container/providers'

import { inject, injectable } from 'tsyringe'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { ICreateUserTokenDTO } from '../../dtos'
interface IResponse {
  user: {
    name: string
    email: string
  }
  token: string
  refreshToken: string
}

@injectable()
export class AuthenticateUserUseCase {
  constructor (
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private readonly usersTokenRepository: IUserTokenRepository,
    @inject('DateProvider')
    private readonly dateProvider: IDateProvider
  ) {}

  async execute (email: string, password: string): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new AppError('E-mail or password incorrect')

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) throw new AppError('E-mail or password incorrect')

    const token = sign({}, String(process.env.JWT_SECRET), {
      subject: user.id,
      expiresIn: '15m'
    })

    const refreshToken = sign({ email }, String(process.env.JWT_SECRET_REFRESH_TOKEN), {
      subject: user.id,
      expiresIn: '30d'
    })

    const refreshTokenExpiresDate = this.dateProvider.addDays(30)

    const userTokenData: ICreateUserTokenDTO = {
      user_id: user.id,
      expires_date: refreshTokenExpiresDate,
      refresh_token: refreshToken
    }

    await this.usersTokenRepository.create(userTokenData)

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      },
      refreshToken
    }

    return tokenReturn
  }
}

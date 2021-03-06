
import 'reflect-metadata'

import { AuthenticateUserUseCase, CreateUserUseCase } from '@/modules/accounts/usecases'
import { UserRepositorySpy, UserTokenRepositorySpy } from '@/tests/modules/accounts/mocks'
import { ICreateUserDTO } from '@/modules/accounts/dtos'
import { AppError } from '@/shared/errors'
import { DayJSProvider } from '@/shared/container/providers'

type SutTypes = {
  sut: AuthenticateUserUseCase
  createUserUseCase: CreateUserUseCase
  userRepositorySpy: UserRepositorySpy
  userTokenRepositorySpy: UserTokenRepositorySpy
  dateProvider: DayJSProvider
}

const makeSut = (): SutTypes => {
  const userRepositorySpy = new UserRepositorySpy()
  const userTokenRepositorySpy = new UserTokenRepositorySpy()
  const dateProvider = new DayJSProvider()
  const createUserUseCase = new CreateUserUseCase(userRepositorySpy)
  const sut = new AuthenticateUserUseCase(userRepositorySpy, userTokenRepositorySpy, dateProvider)
  return {
    sut,
    userRepositorySpy,
    createUserUseCase,
    userTokenRepositorySpy,
    dateProvider
  }
}

const makeUser = (): ICreateUserDTO => ({
  driver_license: 'any_driver_license',
  email: 'any_email@mail.com',
  password: 'any_passwprd',
  name: 'any_user'
})

describe('Authenticate User', () => {
  it('should be able to authenticate user', async () => {
    const { sut, createUserUseCase } = makeSut()
    const user = makeUser()

    await createUserUseCase.execute(makeUser())
    const response = await sut.execute(user.email, user.password)

    expect(response).toHaveProperty('token')
  })

  it('should not be able to authenticate a non existent user', async () => {
    const { sut } = makeSut()
    const user = makeUser()
    await expect(sut.execute(user.email, user.password)).rejects.toBeInstanceOf(AppError)
  })

  it('shout not be able to authenticate with incorrect password', async () => {
    const { sut, createUserUseCase } = makeSut()
    const user = makeUser()
    await createUserUseCase.execute(user)
    await expect(sut.execute(user.email, 'incorrect_password')).rejects.toBeInstanceOf(AppError)
  })
})

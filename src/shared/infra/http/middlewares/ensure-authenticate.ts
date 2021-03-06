import { UserRepository } from '@/modules/accounts/infra/typeorm/repositories'
import { AppError } from '@/shared/errors'

import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export async function ensureAuthenticate (request: Request, _: Response, next: NextFunction) {
  const authHeader = request.headers.authorization
  if (!authHeader) throw new AppError('Token is missing', 401)

  const [, token] = authHeader.split(' ')

  try {
    const { sub: user_id } = verify(token, process.env.JWT_SECRET) as IPayload

    request.user = { id: user_id }

    next()
  } catch {
    throw new AppError('Invalid token!', 401)
  }
}

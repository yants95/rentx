import { UserRepository } from "@/modules/accounts/repositories";
import { AppError } from "@/shared/errors";

import { NextFunction, Request, Response } from "express";

export async function ensureAdmin(request: Request, _: Response, next: NextFunction) {
    const { id } = request.user;
    const userRepository = new UserRepository()
    const user = await userRepository.findById(id)

    console.log(user)

    if (!user.isAdmin) throw new AppError('User is not an admin!')

    return next()
}
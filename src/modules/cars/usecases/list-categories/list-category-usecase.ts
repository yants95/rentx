import { Category } from '@/modules/cars/entities/category'
import { ICategoryRepository } from '@/modules/cars/repositories'

import { inject, injectable } from 'tsyringe'
@injectable()
export class ListCategoryUseCase {
    constructor(
        @inject('CategoryRepository')
        private categoriesRepository: ICategoryRepository
    ) {}

    async execute(): Promise<Category[]> {
        return await this.categoriesRepository.list()
    } 
}
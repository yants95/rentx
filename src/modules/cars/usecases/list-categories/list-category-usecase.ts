import { Category } from '@/modules/cars/model/category'
import { ICategoryRepository } from '@/modules/cars/repositories'

export class ListCategoryUseCase {
    constructor(private categoriesRepository: ICategoryRepository) {}

    execute(): Category[] {
        return this.categoriesRepository.list()
    } 
}
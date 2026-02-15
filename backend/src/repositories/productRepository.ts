import { BaseRepository } from './baseRepository';
import { Product, IProduct } from '../models/Product';

export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(Product);
  }

  // Specific product queries can go here (e.g., findByCategory)
  async findActive(filter: any = {}, sort: any = {}, limit: number, skip: number): Promise<IProduct[]> {
    return await this.model.find({ ...filter, isActive: true })
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .populate('category', 'name slug');
  }
}
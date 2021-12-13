import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Product, ProductRelations, Order} from '../models';
import {OrderRepository} from './order.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.Id,
  ProductRelations
> {

  public readonly order: HasOneRepositoryFactory<Order, typeof Product.prototype.Id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('OrderRepository') protected orderRepositoryGetter: Getter<OrderRepository>,
  ) {
    super(Product, dataSource);
    this.order = this.createHasOneRepositoryFactoryFor('order', orderRepositoryGetter);
    this.registerInclusionResolver('order', this.order.inclusionResolver);
  }
}

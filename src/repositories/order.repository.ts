import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Order, OrderRelations, Person} from '../models';
import {PersonRepository} from './person.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {

  public readonly person: BelongsToAccessor<Person, typeof Order.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PersonRepository') protected personRepositoryGetter: Getter<PersonRepository>,
  ) {
    super(Order, dataSource);
    this.person = this.createBelongsToAccessorFor('person', personRepositoryGetter,);
    this.registerInclusionResolver('person', this.person.inclusionResolver);
  }
}

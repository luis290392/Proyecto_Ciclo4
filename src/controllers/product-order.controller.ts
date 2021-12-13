import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Product,
  Order,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductOrderController {
  constructor(
    @repository(ProductRepository) protected productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/order', {
    responses: {
      '200': {
        description: 'Product has one Order',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Order),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Order>,
  ): Promise<Order> {
    return this.productRepository.order(id).get(filter);
  }

  @post('/products/{id}/order', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Order)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Product.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewOrderInProduct',
            exclude: ['id'],
            optional: ['productId']
          }),
        },
      },
    }) order: Omit<Order, 'id'>,
  ): Promise<Order> {
    return this.productRepository.order(id).create(order);
  }

  @patch('/products/{id}/order', {
    responses: {
      '200': {
        description: 'Product.Order PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Partial<Order>,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.productRepository.order(id).patch(order, where);
  }

  @del('/products/{id}/order', {
    responses: {
      '200': {
        description: 'Product.Order DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.productRepository.order(id).delete(where);
  }
}

import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Person} from '../models';
import {PersonRepository} from '../repositories';
import {AuthenticationService} from '../services';
const fetch = require('node-fetch')
export class PersonController {
  constructor(
    @repository(PersonRepository)
    public personRepository: PersonRepository,
    @service(AuthenticationService)
    public authentication_service: AuthenticationService
  ) { }

  @post('/people')
  @response(200, {
    description: 'Person model instance',
    content: {'application/json': {schema: getModelSchemaRef(Person)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Person, {
            title: 'NewPerson',
            exclude: ['id'],
          }),
        },
      },
    })
    person: Omit<Person, 'id'>,
  ): Promise<Person> {
    let password = this.authentication_service.GeneratePasswordFunction();
    let password_encrypt = this.authentication_service.EncryptPasswordFunction(password);
    person.password = password_encrypt;
    let inst_person = await this.personRepository.create(person);
    //Cuerpo del correo electronico
    let destine = person.email;
    let subject = 'Registro en la plataforma e-commerce Mintic';
    let content = `Atento saludo. Mr ${person.name}, nos ha suministrado este correo como correo de contacto ${person.email} y el password es ${person.password}`;
    fetch(`http://127.0.0.1.5000/correos?destino=${destine}&asunto=${subject}&contenido${content}`)
      .then((data: any) => {
        console.log(data);

      })
    return inst_person;
  }

  @get('/people/count')
  @response(200, {
    description: 'Person model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Person) where?: Where<Person>,
  ): Promise<Count> {
    return this.personRepository.count(where);
  }

  @get('/people')
  @response(200, {
    description: 'Array of Person model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Person, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Person) filter?: Filter<Person>,
  ): Promise<Person[]> {
    return this.personRepository.find(filter);
  }

  @patch('/people')
  @response(200, {
    description: 'Person PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Person, {partial: true}),
        },
      },
    })
    person: Person,
    @param.where(Person) where?: Where<Person>,
  ): Promise<Count> {
    return this.personRepository.updateAll(person, where);
  }

  @get('/people/{id}')
  @response(200, {
    description: 'Person model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Person, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Person, {exclude: 'where'}) filter?: FilterExcludingWhere<Person>
  ): Promise<Person> {
    return this.personRepository.findById(id, filter);
  }

  @patch('/people/{id}')
  @response(204, {
    description: 'Person PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Person, {partial: true}),
        },
      },
    })
    person: Person,
  ): Promise<void> {
    await this.personRepository.updateById(id, person);
  }

  @put('/people/{id}')
  @response(204, {
    description: 'Person PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() person: Person,
  ): Promise<void> {
    await this.personRepository.replaceById(id, person);
  }

  @del('/people/{id}')
  @response(204, {
    description: 'Person DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.personRepository.deleteById(id);
  }
}

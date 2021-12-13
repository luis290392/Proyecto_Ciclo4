import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Person} from '../models';
import {PersonRepository} from '../repositories';
const generate_password = require('password-generator')
const encryptar_password = require('crypto-js')
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  constructor(
    @repository(PersonRepository)
    public person_repository: PersonRepository
  ) { }

  /*
   * Add service methods here
   */
  GeneratePasswordFunction() {
    let password = generate_password(6, false);
    return password;

  }

  EncryptPasswordFunction(password: string) {
    let password_encrypt = encryptar_password.MD5(password).toString();
    return password_encrypt;

  }

  ShowInfoPerson(user_email: string, password: string) {
    try {
      let person = this.person_repository.findOne({where: {email: user_email, password: password}});
      if (person) {
        return person;
      }
      return false;
    } catch {
      return false;

    }
  }

  GenerateTokenJWT(person: Person) {
    let token = jwt.sign({
      data: {
        id: person.id,
        name: person.name,
        email: person.email,

      }
    })

  }
}


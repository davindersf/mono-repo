import {Getter, inject} from '@loopback/core';
import {DataObject, AnyObject} from '@loopback/repository';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DbDataSource} from '../datasources';
import {User, UserRelations} from '../models';
import * as bcrypt from 'bcrypt';
import {HttpErrors} from '@loopback/rest';

export class UserRepository extends DefaultSoftCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER, {optional: true})
    protected readonly getCurrentUser: Getter<User | undefined>,
  ) {
    super(User, dataSource, getCurrentUser);
  }

  private readonly saltRounds = 10;

  async create(
    entity: DataObject<User>,
    options?: AnyObject | undefined,
  ): Promise<User> {
    const {password, ...rest} = entity;

    if (typeof password !== 'string') {
      throw new HttpErrors.BadRequest();
    }

    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new HttpErrors.BadRequest();
    }

    const user = await super.create(
      {...rest, password: hashedPassword},
      options,
    );

    return user;
  }
}

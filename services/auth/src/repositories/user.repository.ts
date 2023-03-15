import {Getter, inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DbDataSource} from '../datasources';
import {User, UserRelations} from '../models';

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
}

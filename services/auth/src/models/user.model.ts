import {model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {SoftDeleteEntity} from 'loopback4-soft-delete';
import {PermissionKey} from '../enums';

@model({
  name: 'users',
})
export class User extends SoftDeleteEntity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'first_name',
  })
  firstName: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password: string;

  @property({
    type: 'array',
    itemType: 'string',
    jsonSchema: {
      enum: Object.values(PermissionKey),
    },
    postgresql: {
      dataType: 'varchar[]',
    },
  })
  permissions: PermissionKey[];

  getIdentifier() {
    return this.username;
  }

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;

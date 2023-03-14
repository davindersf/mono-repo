import {property} from '@loopback/repository';

export class LoginDto {
  @property({
    type: 'string',
    require: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

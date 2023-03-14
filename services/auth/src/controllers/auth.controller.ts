import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody, response} from '@loopback/rest';
import {LoginDto, User} from '../models';
import {UserRepository} from '../repositories';
import * as jwt from 'jsonwebtoken';
import {authorize} from 'loopback4-authorization';

export class AuthController {
  constructor(
    @repository(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  @authorize({
    permissions: ['*'],
  })
  @post('/auth/login')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            accessToken: {type: 'string'},
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            'x-ts-type': LoginDto,
          },
        },
      },
    })
    loginDto: LoginDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginDto.username,
      },
    });

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    if (user.password !== loginDto.password) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // eslint-disable-next-line
    const {password, ...payload} = user.toObject() as User;

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      issuer: process.env.JWT_ISSUER,
      expiresIn: process.env.JWT_EXPIRY,
    });

    return {
      accessToken,
    };
  }
}

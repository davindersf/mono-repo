import {User} from '../models';

export type AuthUser = Omit<User, 'password'>;

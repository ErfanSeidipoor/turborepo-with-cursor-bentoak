import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Country } from './country.entity';
import { City } from './city.entity';
import { Location } from './location.entity';

export const entities = [BaseEntity, User, Country, City, Location];

export { BaseEntity, User, Country, City, Location };

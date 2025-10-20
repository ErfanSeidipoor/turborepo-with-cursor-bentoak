import { Activity } from './activity.entity';
import { ActivityComment } from './activity-comment.entity';
import { ActivityLike } from './activity-like.entity';
import { ActivityPricing } from './activity-pricing.entity';
import { ActivityTag } from './activity-tag.entity';
import { BaseEntity } from './base.entity';
import { City } from './city.entity';
import { Country } from './country.entity';
import { Location } from './location.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

export const entities = [
  Activity,
  ActivityComment,
  ActivityLike,
  ActivityPricing,
  ActivityTag,
  BaseEntity,
  City,
  Country,
  Location,
  Tag,
  User,
];

export {
  Activity,
  ActivityComment,
  ActivityLike,
  ActivityPricing,
  ActivityTag,
  BaseEntity,
  City,
  Country,
  Location,
  Tag,
  User,
};

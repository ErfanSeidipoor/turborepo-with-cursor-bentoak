import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Location } from './location.entity';
import { ActivityTypeEnum } from '@repo/enums';
import { ActivityPricing } from './activity-pricing.entity';
import { ActivityComment } from './activity-comment.entity';
import { ActivityLike } from './activity-like.entity';
import { ActivityTag } from './activity-tag.entity';

/**
 * TABLE-NAME: activities
 * TABLE-DESCRIPTION: Stores activity information including events and location-based activities for families and children
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - slug must be unique for URL-friendly identification
 *   - type is required and must be either LOCATION or EVENT
 *   - created_by is required (foreign key to users table)
 *   - location_id is optional (foreign key to locations table)
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many activities belong to one user (creator)
 *   - Many activities can reference one location
 *   - One activity can have many pricing options
 *   - One activity can have many comments
 *   - One activity can have many likes
 *   - One activity can be associated with many tags through activity_tag junction table
 */
@Entity('activities')
export class Activity extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Title of the activity
   */
  @Column({
    type: 'varchar',
    length: 500,
    name: 'title',
    nullable: false,
  })
  public title: string;

  /**
   * COLUMN-DESCRIPTION: URL-friendly unique slug for the activity
   */
  @Column({
    type: 'varchar',
    length: 500,
    name: 'slug',
    unique: true,
    nullable: false,
  })
  public slug: string;

  /**
   * COLUMN-DESCRIPTION: Detailed description of the activity
   */
  @Column({
    type: 'text',
    name: 'description',
    nullable: true,
  })
  public description: string | null;

  /**
   * COLUMN-DESCRIPTION: Array of age range strings suitable for this activity (e.g., "0-5", "5-12")
   */
  @Column({
    type: 'text',
    array: true,
    name: 'age_range',
    nullable: true,
  })
  public ageRange: string[] | null;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the location where this activity takes place (optional)
   */
  @Column({
    type: 'uuid',
    name: 'location_id',
    nullable: true,
  })
  public locationId: string | null;

  /**
   * COLUMN-DESCRIPTION: Indicates whether the activity is indoor or outdoor
   */
  @Column({
    type: 'boolean',
    name: 'is_indoor',
    nullable: true,
  })
  public isIndoor: boolean | null;

  /**
   * COLUMN-DESCRIPTION: Type of activity - either LOCATION (venue-based) or EVENT (time-specific)
   */
  @Column({
    type: 'enum',
    enum: ActivityTypeEnum,
    name: 'type',
    nullable: false,
  })
  public type: ActivityTypeEnum;

  /**
   * COLUMN-DESCRIPTION: Start date and time for event-type activities
   */
  @Column({
    type: 'timestamptz',
    name: 'event_start_date',
    nullable: true,
  })
  public eventStartDate: Date | null;

  /**
   * COLUMN-DESCRIPTION: End date and time for event-type activities
   */
  @Column({
    type: 'timestamptz',
    name: 'event_end_date',
    nullable: true,
  })
  public eventEndDate: Date | null;

  /**
   * COLUMN-DESCRIPTION: Array of contact phone numbers for the activity
   */
  @Column({
    type: 'text',
    array: true,
    name: 'contact_number',
    nullable: true,
  })
  public contactNumber: string[] | null;

  /**
   * COLUMN-DESCRIPTION: Array of contact email addresses for the activity
   */
  @Column({
    type: 'text',
    array: true,
    name: 'contact_email',
    nullable: true,
  })
  public contactEmail: string[] | null;

  /**
   * COLUMN-DESCRIPTION: Array of website URLs related to the activity
   */
  @Column({
    type: 'text',
    array: true,
    name: 'contact_website',
    nullable: true,
  })
  public contactWebsite: string[] | null;

  /**
   * COLUMN-DESCRIPTION: Array of physical addresses where the activity can be accessed
   */
  @Column({
    type: 'text',
    array: true,
    name: 'address',
    nullable: true,
  })
  public address: string[] | null;

  /**
   * COLUMN-DESCRIPTION: Array of additional options or features available for the activity
   */
  @Column({
    type: 'text',
    array: true,
    name: 'options',
    nullable: true,
  })
  public options: string[] | null;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the user who created this activity
   */
  @Column({
    type: 'uuid',
    name: 'created_by',
    nullable: false,
  })
  public createdBy: string;

  /**
   * RELATIONSHIP-DESCRIPTION: The user who created this activity
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  public creator: User;

  /**
   * RELATIONSHIP-DESCRIPTION: The location where this activity takes place
   */
  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id' })
  public location: Location | null;

  /**
   * RELATIONSHIP-DESCRIPTION: Pricing options for this activity
   */
  @OneToMany(() => ActivityPricing, (pricing) => pricing.activity, {
    cascade: false,
    eager: false,
  })
  public pricings: ActivityPricing[];

  /**
   * RELATIONSHIP-DESCRIPTION: Comments on this activity
   */
  @OneToMany(() => ActivityComment, (comment) => comment.activity, {
    cascade: false,
    eager: false,
  })
  public comments: ActivityComment[];

  /**
   * RELATIONSHIP-DESCRIPTION: Likes on this activity
   */
  @OneToMany(() => ActivityLike, (like) => like.activity, {
    cascade: false,
    eager: false,
  })
  public likes: ActivityLike[];

  /**
   * RELATIONSHIP-DESCRIPTION: Tags associated with this activity through the junction table
   */
  @OneToMany(() => ActivityTag, (activityTag) => activityTag.activity, {
    cascade: false,
    eager: false,
  })
  public activityTags: ActivityTag[];
}

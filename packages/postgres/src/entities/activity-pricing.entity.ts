import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Activity } from './activity.entity';
import { CurrencyEnum } from '@repo/enums';

/**
 * TABLE-NAME: activity_pricing
 * TABLE-DESCRIPTION: Stores pricing information for activities with different currency options
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - activity_id is required (foreign key to activities table)
 *   - amount and currency are required
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many pricing entries belong to one activity
 */
@Entity('activity_pricing')
export class ActivityPricing extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the activity this pricing belongs to
   */
  @Column({
    type: 'uuid',
    name: 'activity_id',
    nullable: false,
  })
  public activityId: string;

  /**
   * COLUMN-DESCRIPTION: Price amount with 2 decimal places
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'amount',
    nullable: false,
  })
  public amount: number;

  /**
   * COLUMN-DESCRIPTION: Currency code for the price (CAD, EUR, USD, GBP)
   */
  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    name: 'currency',
    nullable: false,
  })
  public currency: CurrencyEnum;

  /**
   * COLUMN-DESCRIPTION: Array of additional pricing options or details
   */
  @Column({
    type: 'text',
    array: true,
    name: 'options',
    nullable: true,
  })
  public options: string[] | null;

  /**
   * RELATIONSHIP-DESCRIPTION: The activity this pricing belongs to
   */
  @ManyToOne(() => Activity, (activity) => activity.pricings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  public activity: Activity;
}

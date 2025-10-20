import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Activity } from './activity.entity';
import { User } from './user.entity';

/**
 * TABLE-NAME: activity_like
 * TABLE-DESCRIPTION: Stores user likes on activities
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - activity_id is required (foreign key to activities table)
 *   - user_id is required (foreign key to users table)
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many likes belong to one activity
 *   - Many likes belong to one user
 */
@Entity('activity_like')
export class ActivityLike extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the activity being liked
   */
  @Column({
    type: 'uuid',
    name: 'activity_id',
    nullable: false,
  })
  public activityId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the user who liked this activity
   */
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  public userId: string;

  /**
   * RELATIONSHIP-DESCRIPTION: The activity this like belongs to
   */
  @ManyToOne(() => Activity, (activity) => activity.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  public activity: Activity;

  /**
   * RELATIONSHIP-DESCRIPTION: The user who liked this activity
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}

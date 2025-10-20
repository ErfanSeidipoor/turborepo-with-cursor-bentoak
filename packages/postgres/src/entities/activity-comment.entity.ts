import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Activity } from './activity.entity';
import { User } from './user.entity';

/**
 * TABLE-NAME: activity_comment
 * TABLE-DESCRIPTION: Stores user comments on activities
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - activity_id is required (foreign key to activities table)
 *   - user_id is required (foreign key to users table)
 *   - comment text is required
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many comments belong to one activity
 *   - Many comments belong to one user
 */
@Entity('activity_comment')
export class ActivityComment extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the activity being commented on
   */
  @Column({
    type: 'uuid',
    name: 'activity_id',
    nullable: false,
  })
  public activityId: string;

  /**
   * COLUMN-DESCRIPTION: The comment text content
   */
  @Column({
    type: 'text',
    name: 'comment',
    nullable: false,
  })
  public comment: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the user who wrote this comment
   */
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: false,
  })
  public userId: string;

  /**
   * RELATIONSHIP-DESCRIPTION: The activity this comment belongs to
   */
  @ManyToOne(() => Activity, (activity) => activity.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  public activity: Activity;

  /**
   * RELATIONSHIP-DESCRIPTION: The user who wrote this comment
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;
}

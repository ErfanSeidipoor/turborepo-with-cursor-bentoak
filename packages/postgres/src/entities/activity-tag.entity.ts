import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Activity } from './activity.entity';
import { Tag } from './tag.entity';

/**
 * TABLE-NAME: activity_tag
 * TABLE-DESCRIPTION: Junction table linking activities with tags for categorization
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - activity_id is required (foreign key to activities table)
 *   - tag_id is required (foreign key to tags table)
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many activity-tag entries belong to one activity
 *   - Many activity-tag entries belong to one tag
 */
@Entity('activity_tag')
export class ActivityTag extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the activity
   */
  @Column({
    type: 'uuid',
    name: 'activity_id',
    nullable: false,
  })
  public activityId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the tag
   */
  @Column({
    type: 'uuid',
    name: 'tag_id',
    nullable: false,
  })
  public tagId: string;

  /**
   * RELATIONSHIP-DESCRIPTION: The activity this entry belongs to
   */
  @ManyToOne(() => Activity, (activity) => activity.activityTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  public activity: Activity;

  /**
   * RELATIONSHIP-DESCRIPTION: The tag this entry belongs to
   */
  @ManyToOne(() => Tag, (tag) => tag.activityTags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  public tag: Tag;
}

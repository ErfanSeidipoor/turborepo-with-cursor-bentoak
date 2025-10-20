import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ActivityTag } from './activity-tag.entity';

/**
 * TABLE-NAME: tags
 * TABLE-DESCRIPTION: Stores tags that can be associated with activities for categorization and search purposes
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - name must be unique
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - One tag can be associated with many activities through activity_tag junction table
 */
@Entity('tags')
export class Tag extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Unique name of the tag
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'name',
    unique: true,
    nullable: false,
  })
  public name: string;

  /**
   * RELATIONSHIP-DESCRIPTION: Activities associated with this tag through the junction table
   */
  @OneToMany(() => ActivityTag, (activityTag) => activityTag.tag, {
    cascade: false,
    eager: false,
  })
  public activityTags: ActivityTag[];
}

import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { City } from './city.entity';

/**
 * TABLE-NAME: countries
 * TABLE-DESCRIPTION: Stores country information for geographical reference
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - name must be unique across all countries
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - One country can have many cities (OneToMany with City entity)
 *   - Referenced by locations table for location assignments
 */
@Entity('countries')
export class Country extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Unique country name, maximum 255 characters
   */
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    name: 'name',
  })
  public name: string;

  /**
   * RELATIONSHIP-DESCRIPTION: Cities belonging to this country
   */
  @OneToMany(() => City, (city) => city.country)
  public cities: City[];
}

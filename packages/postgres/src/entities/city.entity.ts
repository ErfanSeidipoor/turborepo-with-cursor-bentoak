import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Country } from './country.entity';

/**
 * TABLE-NAME: cities
 * TABLE-DESCRIPTION: Stores city information with reference to their country
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - country_id is a foreign key reference to countries table
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many cities belong to one country (ManyToOne with Country entity)
 *   - One city can have many locations (OneToMany with Location entity)
 */
@Entity('cities')
export class City extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: City name, maximum 255 characters
   */
  @Column({
    type: 'varchar',
    length: 255,
    name: 'name',
  })
  public name: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the country this city belongs to
   */
  @Column({
    type: 'uuid',
    name: 'country_id',
  })
  public countryId: string;

  /**
   * RELATIONSHIP-DESCRIPTION: The country this city belongs to
   */
  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  public country: Country;

  /**
   * RELATIONSHIP-DESCRIPTION: Locations within this city
   */
  @OneToMany('Location', 'city')
  public locations: any[];
}

import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { City } from './city.entity';
import { Country } from './country.entity';

/**
 * TABLE-NAME: locations
 * TABLE-DESCRIPTION: Stores geographical location data with latitude and longitude coordinates
 * TABLE-IMPORTANT-CONSTRAINTS:
 *   - city_id is a foreign key reference to cities table
 *   - country_id is a foreign key reference to countries table
 *   - lat uses decimal(10,8) for precise latitude storage (-90 to 90 degrees)
 *   - lng uses decimal(11,8) for precise longitude storage (-180 to 180 degrees)
 *   - inherits id (UUID), createdAt, updatedAt, and deletedAt from BaseEntity
 * TABLE-RELATIONSHIPS:
 *   - Many locations belong to one city (ManyToOne with City entity)
 *   - Many locations belong to one country (ManyToOne with Country entity)
 */
@Entity('locations')
export class Location extends BaseEntity {
  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the city this location is in
   */
  @Column({
    type: 'uuid',
    name: 'city_id',
  })
  public cityId: string;

  /**
   * COLUMN-DESCRIPTION: Foreign key reference to the country this location is in
   */
  @Column({
    type: 'uuid',
    name: 'country_id',
  })
  public countryId: string;

  /**
   * COLUMN-DESCRIPTION: Latitude coordinate with 8 decimal places precision for accurate positioning
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 8,
    name: 'lat',
  })
  public lat: number;

  /**
   * COLUMN-DESCRIPTION: Longitude coordinate with 8 decimal places precision for accurate positioning
   */
  @Column({
    type: 'decimal',
    precision: 11,
    scale: 8,
    name: 'lng',
  })
  public lng: number;

  /**
   * RELATIONSHIP-DESCRIPTION: The city this location belongs to
   */
  @ManyToOne(() => City, (city) => city.locations)
  @JoinColumn({ name: 'city_id' })
  public city: City;

  /**
   * RELATIONSHIP-DESCRIPTION: The country this location belongs to
   */
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  public country: Country;
}

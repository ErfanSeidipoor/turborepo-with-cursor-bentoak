import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DatabaseCreateTable,
  DatabaseCreateForeignKey,
  DatabaseDropForeignKey,
} from './utils';

export class CreateLocationTables1760956682244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create countries table
    await DatabaseCreateTable(queryRunner, 'countries', [
      {
        name: 'name',
        type: 'varchar',
        length: '255',
        isUnique: true,
        isNullable: false,
      },
    ]);

    // Create cities table
    await DatabaseCreateTable(queryRunner, 'cities', [
      {
        name: 'name',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'country_id',
        type: 'uuid',
        isNullable: false,
      },
    ]);

    // Create foreign key: cities.country_id -> countries.id
    await DatabaseCreateForeignKey(
      queryRunner,
      'cities',
      'countries',
      'country_id',
    );

    // Create locations table
    await DatabaseCreateTable(queryRunner, 'locations', [
      {
        name: 'city_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'country_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'lat',
        type: 'decimal',
        precision: 10,
        scale: 8,
        isNullable: false,
      },
      {
        name: 'lng',
        type: 'decimal',
        precision: 11,
        scale: 8,
        isNullable: false,
      },
    ]);

    // Create foreign keys for locations table
    await DatabaseCreateForeignKey(
      queryRunner,
      'locations',
      'cities',
      'city_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'locations',
      'countries',
      'country_id',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys from locations table
    await DatabaseDropForeignKey(queryRunner, 'locations', 'cities', 'city_id');
    await DatabaseDropForeignKey(
      queryRunner,
      'locations',
      'countries',
      'country_id',
    );

    // Drop foreign key from cities table
    await DatabaseDropForeignKey(
      queryRunner,
      'cities',
      'countries',
      'country_id',
    );

    // Drop tables in reverse order
    await queryRunner.dropTable('locations');
    await queryRunner.dropTable('cities');
    await queryRunner.dropTable('countries');
  }
}

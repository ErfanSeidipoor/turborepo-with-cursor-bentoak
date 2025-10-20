import { MigrationInterface, QueryRunner } from 'typeorm';
import {
  DatabaseCreateTable,
  DatabaseCreateForeignKey,
  DatabaseDropForeignKey,
} from './utils';

export class CreateActivityTables1760957417800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tags table
    await DatabaseCreateTable(queryRunner, 'tags', [
      {
        name: 'name',
        type: 'varchar',
        length: '255',
        isUnique: true,
        isNullable: false,
      },
    ]);

    // Create activities table
    await DatabaseCreateTable(queryRunner, 'activities', [
      {
        name: 'title',
        type: 'varchar',
        length: '500',
        isNullable: false,
      },
      {
        name: 'slug',
        type: 'varchar',
        length: '500',
        isNullable: false,
        isUnique: true,
      },
      {
        name: 'description',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'age_range',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
      {
        name: 'location_id',
        type: 'uuid',
        isNullable: true,
      },
      {
        name: 'is_indoor',
        type: 'boolean',
        isNullable: true,
      },
      {
        name: 'type',
        type: 'enum',
        enum: ['LOCATION', 'EVENT'],
        isNullable: false,
      },
      {
        name: 'event_start_date',
        type: 'timestamptz',
        isNullable: true,
      },
      {
        name: 'event_end_date',
        type: 'timestamptz',
        isNullable: true,
      },
      {
        name: 'contact_number',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
      {
        name: 'contact_email',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
      {
        name: 'contact_website',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
      {
        name: 'address',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
      {
        name: 'options',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
      {
        name: 'created_by',
        type: 'uuid',
        isNullable: false,
      },
    ]);

    // Create foreign keys for activities table
    await DatabaseCreateForeignKey(
      queryRunner,
      'activities',
      'locations',
      'location_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'activities',
      'users',
      'created_by',
    );

    // Create activity_pricing table
    await DatabaseCreateTable(queryRunner, 'activity_pricing', [
      {
        name: 'activity_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'amount',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: false,
      },
      {
        name: 'currency',
        type: 'enum',
        enum: ['CAD', 'EUR', 'USD', 'GBP'],
        isNullable: false,
      },
      {
        name: 'options',
        type: 'text',
        isArray: true,
        isNullable: true,
      },
    ]);

    // Create foreign key for activity_pricing
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_pricing',
      'activities',
      'activity_id',
    );

    // Create activity_comment table
    await DatabaseCreateTable(queryRunner, 'activity_comment', [
      {
        name: 'activity_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'comment',
        type: 'text',
        isNullable: false,
      },
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      },
    ]);

    // Create foreign keys for activity_comment
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_comment',
      'activities',
      'activity_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_comment',
      'users',
      'user_id',
    );

    // Create activity_like table
    await DatabaseCreateTable(queryRunner, 'activity_like', [
      {
        name: 'activity_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'user_id',
        type: 'uuid',
        isNullable: false,
      },
    ]);

    // Create foreign keys for activity_like
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_like',
      'activities',
      'activity_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_like',
      'users',
      'user_id',
    );

    // Create activity_tag junction table
    await DatabaseCreateTable(queryRunner, 'activity_tag', [
      {
        name: 'activity_id',
        type: 'uuid',
        isNullable: false,
      },
      {
        name: 'tag_id',
        type: 'uuid',
        isNullable: false,
      },
    ]);

    // Create foreign keys for activity_tag
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_tag',
      'activities',
      'activity_id',
    );
    await DatabaseCreateForeignKey(
      queryRunner,
      'activity_tag',
      'tags',
      'tag_id',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys from activity_tag
    await DatabaseDropForeignKey(
      queryRunner,
      'activity_tag',
      'activities',
      'activity_id',
    );
    await DatabaseDropForeignKey(queryRunner, 'activity_tag', 'tags', 'tag_id');

    // Drop foreign keys from activity_like
    await DatabaseDropForeignKey(
      queryRunner,
      'activity_like',
      'activities',
      'activity_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'activity_like',
      'users',
      'user_id',
    );

    // Drop foreign keys from activity_comment
    await DatabaseDropForeignKey(
      queryRunner,
      'activity_comment',
      'activities',
      'activity_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'activity_comment',
      'users',
      'user_id',
    );

    // Drop foreign key from activity_pricing
    await DatabaseDropForeignKey(
      queryRunner,
      'activity_pricing',
      'activities',
      'activity_id',
    );

    // Drop foreign keys from activities
    await DatabaseDropForeignKey(
      queryRunner,
      'activities',
      'locations',
      'location_id',
    );
    await DatabaseDropForeignKey(
      queryRunner,
      'activities',
      'users',
      'created_by',
    );

    // Drop tables in reverse order
    await queryRunner.dropTable('activity_tag');
    await queryRunner.dropTable('activity_like');
    await queryRunner.dropTable('activity_comment');
    await queryRunner.dropTable('activity_pricing');
    await queryRunner.dropTable('activities');
    await queryRunner.dropTable('tags');
  }
}

---
description: This Cursor rule defines the standards and step-by-step process for changing the PostgreSQL database schema via TypeORM migrations, enums, and entities in the monorepo.
globs:
alwaysApply: false
---

# task: change postgres database (@postgres.mdc)

// This rule standardizes how to change the PostgreSQL schema across the monorepo using TypeORM migrations in `@repo/postgres`, enum definitions in `@repo/enums`, and entity updates in `@repo/postgres/src/entities`. It mirrors the structure of other task rules and must be followed to ensure consistency and safe, reversible schema changes.

## Inputs Required to Apply This Rule

Provide the following input:

- `TASK_DESCRIPTION`:(required) A clear description of the change including:
  - The target table(s) and exact column changes to add/remove/alter
  - Any foreign keys to create/update/remove (with source and target tables/columns and desired onDelete/onUpdate behavior)
  - Column types, nullability, defaults, unique constraints, and indexes
  - Any enum fields involved and their allowed values

## Environment Variables

- All environment variables required for database connections, credentials, or configuration **must** be defined in the `.env` file located at the project root directory. If you need to access these environment variables from any subfolder (such as during migration scripts or local development), **copy and paste** the `.env` file into that subfolder to ensure environment variable resolution works as expected. This practice ensures consistency and prevents issues with missing or misconfigured environment variables during migration execution or development tasks.

The following subtasks must be implemented to deliver a compliant and reversible database change:

- Subtasks for Postgres Database Change

1. SUBTASK-1: Create a new feature branch from main

- Before making any changes, create a new local feature branch from the latest `main` branch.
- Use the following naming convention for the branch:  
  `feature/db-change-<short-migration-name>`  
  (Replace `<short-migration-name>` with a concise, descriptive name for the migration, e.g., `add-status-to-orders`.)
- If a branch with this name already exists, append an incrementing number (e.g., `feature/db-change-<short-migration-name>-2`).
- Example commands:
  ```bash
  git checkout main
  git pull
  git checkout -b feature/db-change-<short-migration-name>
  ```
- This ensures all work is isolated, traceable, and ready for review before merging into the main branch.

2. SUBTASK-2: Validate inputs and prepare workspace

- Ensure `TASK_DESCRIPTION` is precise (table names, columns, types, relations, enum values).
- Work from `packages/postgres` when running migration commands (see `packages/postgres/package.json`).
- Confirm the migration command scripts exist: `migration:create`, `migration:run`, `migration:revert`.

3. SUBTASK-3: Review previous migrations for conflicts

- Before implementing the migration, review all existing migration files in `packages/postgres/src/migrations/`.
- Identify all previous changes affecting the target tables and columns described in `TASK_DESCRIPTION`.
- Check for potential conflicts, such as:
  - The table or column already exists or was dropped in a previous migration.
  - The column type, nullability, default, or constraints differ from what is being proposed.
  - There are existing indexes, unique constraints, or foreign keys that may conflict with the new change.
- If any conflicts or ambiguities are found, update the migration plan or clarify the intended schema state before proceeding.
- Document any findings or required adjustments in the migration file as comments for future maintainers.
- This review ensures the new migration is consistent with the current schema state and avoids accidental destructive changes or migration failures.

- If you discover any conflict or problem during the review of previous migrations,
- such as:
- - The table or column already exists or was dropped in a previous migration,
- - The column type, nullability, default, or constraints differ from what is being proposed,
- - There are existing indexes, unique constraints, or foreign keys that may conflict with the new change,
- - Any ambiguity about the intended schema state,
- then:
- - Write a clear comment in under the issue describing the conflict or problem.
- - Do NOT continue with the migration or further subtasks until the conflict is resolved and the intended schema state is clarified.
- - This ensures that no destructive or inconsistent changes are introduced into the schema.

4. SUBTASK-4: Create a migration file

- Create a descriptive migration using the workspace scripts (ref. @postgres.mdc Migration Commands Reference).

```bash
# From packages/postgres directory
pnpm migration:create --name=<migration-title>
# choose a short title for migration file
```

- Use a name that clearly reflects the change, e.g., `add-status-to-orders`.

5. SUBTASK-5: Implement up and down methods

- Open the generated file under `packages/postgres/src/migrations/` and implement both `up` and `down` using TypeORM’s `QueryRunner`.
- Follow the guidance from @postgres.mdc:
  - Use helper utilities like `DatabaseCreateTable` and `DatabaseCreateForeignKey` when creating tables/relations.
  - For alters, prefer explicit operations: `addColumn`, `dropColumn`, `changeColumn`, `createIndex`, `dropIndex`, `createForeignKey`, `dropForeignKey` as appropriate.
  - Ensure `down` precisely reverses `up` in the correct order (drop FKs/indexes before dropping columns/tables).
  - Use snake_case for DB names; map to camelCase in entities via the `name` property.
  - consider enum fields they should be type:enum

- The migration file implementation (in `packages/postgres/src/migrations/`) **must** follow the standards and detailed guidance described in `packages/postgres/.cursor/rules/@postgres.md`. This includes:
  - Refer to `@postgres.md` for examples, required patterns, and additional context before writing or reviewing any migration code.

6. SUBTASK-6: Test run and revert twice

- From `packages/postgres`, run migrations and then revert, twice, to confirm reversibility and idempotency (ref. @postgres.mdc):

```bash
# 1st cycle
npm run migration:run
npm run migration:revert

# 2nd cycle
npm run migration:run
npm run migration:revert
```

- The second cycle ensures the `down` logic returns the schema to an identical pre-migration state without residue.

7. SUBTASK-7: Create or update enums in @repo/enums (when enum fields are involved)

- If the change introduces or modifies an enum field at the DB level:
  - Define the corresponding TypeScript enum under `packages/enums/src/` following the @enums.mdc rule.
  - Use PascalCase for enum name and UPPER_SNAKE_CASE for members.
  - Export from `packages/enums/src/index.ts`.

```ts
// packages/enums/src/order-status.enum.ts
export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// packages/enums/src/index.ts
export { OrderStatusEnum } from './order-status.enum';
```

- Reference this enum in entities and, when needed, in migrations that create `enum` columns.
- follow the standards and detailed guidance described in `packages/enums/.cursor/rules/@enums.mdc`.
- The enum field in the migration must match the enum values in the TypeScript enum, If there is any mismatch or ambiguity, update the migration, or enum definition so that all are consistent and correct before proceeding.

8. SUBTASK-8: Update entities under packages/postgres/src/entities

- Reflect the schema changes in entity classes (see @postgres.mdc Entity Definition Checklist):
  - Ensure table name is explicit via `@Entity('table_name')`.
  - Add/alter/remove columns using camelCase properties with snake_case `name` mapping.
  - For enums, set `type: 'enum'` and `enum: YourEnum` and default if applicable.
  - Maintain relationships with correct `@ManyToOne`/`@OneToMany` annotations and FK column names.
  - Update `packages/postgres/src/entities/index.ts` if new entities were added.
  - follow the standards and detailed guidance described in `packages/postgres/.cursor/rules/@postgres.mdc`.

```ts
// Example column mapping
@Column({ name: 'status', type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
status: OrderStatusEnum;
```

9. SUBTASK-9: Ensure entity documentation is up-to-date

- For every entity you add or modify, do the following:
  - At the very top of the entity file, add or update the TABLE-DOCUMENT comment block as shown in the `Table and Column Documentation Standards` section of `packages/postgres/.cursor/rules/@postgres.mdc`.
  - For each column and relationship, add or update a COLUMN-DOCUMENT comment block directly above its decorator, following the format in the same section.

10. SUBTASK-10: Verify TypeScript builds and lints

- Ensure no TypeScript or linter errors due to entity or enum updates:

```bash
# Build affected packages (or the whole workspace if preferred)
pnpm -w --filter @repo/postgres build
pnpm -w --filter @repo/enums build

# Optional: workspace-wide build and lint
pnpm -w build
pnpm -w lint
```

11. SUBTASK-11: Final readiness check

- Confirm the migration applies cleanly and reverts cleanly:
  - Apply once: `npm run migration:run`
  - Revert once: `npm run migration:revert`
- Verify entities accurately mirror the DB schema and exports are correct.
- If other services or modules depend on updated entities or enums, update their imports accordingly.

12. SUBTASK-12: General Rule Compliance

- Review the guidelines described in '.cursor/rules/@general-rules.md'.
- Before submitting any file changes, verify that every item in the general rules has been carefully checked and satisfied.
- Pay particular attention to disallowed patterns (such as use of `any`), correct typing, and any additional standards listed in that file.
- Apply corrections to your code as necessary to ensure full compliance with all general rules across all affected files and code sections.

13. SUBTASK-13: Create a Pull Request (PR)

- After pushing your feature branch to the remote repository, open a Pull Request targeting the `main` branch.
- Ensure your PR includes a clear, descriptive title and summary of the database change, referencing the original issue or task.
- Confirm that all changes are staged and committed (`git add .`), and that your branch is up to date with `main`.
- Verify that all CI checks and code reviews pass before merging.
- Do not merge the PR yourself unless you have explicit approval or are the designated maintainer for this change.

// End of task definition

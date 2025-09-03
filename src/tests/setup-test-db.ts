import { randomUUID } from "crypto";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
//schema
import * as schema from "../db/schemas/schema.ts";
import { join } from "path";

const adminDbUrl = process.env.ADMIN_DB_URL;
const testDbUrl = process.env.TEST_DB_URL;

export type TestDbContext = {
  pool: Pool;
  db: NodePgDatabase<typeof schema>;
  testDbName: string;
};

// create test database
export const createTestDb = async (): Promise<TestDbContext> => {
  const testDbName = `test_db_${randomUUID().replace(/-/g, "")}`;
  const newTestDbUrl = testDbUrl + testDbName;
  const adminPool = new Pool({
    connectionString: adminDbUrl,
  });

  await adminPool.query(`CREATE DATABASE "${testDbName}"`);
  await adminPool.end();

  const pool = new Pool({
    connectionString: newTestDbUrl,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  const db = drizzle(pool, { schema, casing: "snake_case" });

  await migrate(db, {
    migrationsFolder: join(__dirname, "../../drizzle/migrations"),
  });
  return { pool, db, testDbName };
};

// destroy test database
export const destroyTestDb = async ({ pool, testDbName }: TestDbContext) => {
  await pool.end();

  const adminPool = new Pool({
    connectionString: adminDbUrl,
  });
  await adminPool.query(
    `SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1 and pid <> pg_backend_pid()`,
    [testDbName]
  );

  await adminPool.query(`DROP DATABASE IF EXISTS "${testDbName}"`);
  await adminPool.end();
};

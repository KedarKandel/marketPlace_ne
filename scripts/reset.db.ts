import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../src/db/schemas/schema.ts";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "path";

const ADMIN_DB_URL = process.env.ADMIN_DB_URL;
const APP_DB_URL = process.env.DATABASE_URL;

const DB_NAME = APP_DB_URL?.split("/").pop();

async function dropAndCreateDatabase() {
  const adminPool = new Pool({
    connectionString: ADMIN_DB_URL,
  });
  await adminPool.query(
    `SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1 and pid <> pg_backend_pid()`,
    [DB_NAME]
  );

  await adminPool.query(`DROP DATABASE IF EXISTS "${DB_NAME}"`);
  await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
  await adminPool.end();
}

async function runMigration() {
  const pool = new Pool({
    connectionString: APP_DB_URL,
  });
  const db = drizzle(pool, { schema, casing: "snake_case" });

  await migrate(db, {
    migrationsFolder: join(__dirname, "../drizzle/migrations"),
  });
  await pool.end();
}

async function runSeed() {
  const { execSync } = await import("child_process");
  execSync("npm run db:seed", { stdio: "inherit" });
}


async function main(){
    console.log("dropping and recreating database")
    await dropAndCreateDatabase()
    console.log("running migration...")
    await runMigration()
    console.log("seeding database...")
    await runSeed()
    console.log("database reset completed")
}

main().catch((err)=>console.log(err))
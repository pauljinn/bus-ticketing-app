const { Pool } = require("pg");
const getDatabasePool = require("../src/database/db");

async function createDatabase() {
  let pool = getDatabasePool();
  const client = await pool.connect();

  try {
    // Check if the 'bus_ticketing_system' database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'bus_ticketing_system'"
    );

    if (result.rows.length === 0) {
      // Create the 'bus_ticketing_system' database if it doesn't exist
      await client.query("CREATE DATABASE bus_ticketing_system");
      console.log("Database created: bus_ticketing_system");
    } else {
      console.log("Database already exists: bus_ticketing_system");
    }
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    client.release();
    // Close the pool connection after creating the database
    pool.end();
  }
}

async function runMigrations() {
  // Reconfigure the pool to use the newly created 'bus_ticketing_system' database
  let poolForMigration = getDatabasePool();

  const client = await poolForMigration.connect();

  try {
    // Create passengers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS passengers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        seat_number INT
      )
    `);

    console.log("Table created: passengers");

    // Create bus_seats table with a foreign key
    await client.query(`
      CREATE TABLE IF NOT EXISTS bus_seats (
        seat_number SERIAL PRIMARY KEY,
        status VARCHAR(10) NOT NULL DEFAULT 'open',
        passenger_id INT REFERENCES passengers(id)
      )
    `);

    console.log("Table created: bus_seats");

    // Insert 40 seats by default
    for (let seatNumber = 1; seatNumber <= 40; seatNumber++) {
      await client.query(
        `
        INSERT INTO bus_seats (seat_number)
        VALUES ($1)
      `,
        [seatNumber]
      );
    }

    console.log("40 seats created by default");

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    client.release();
    // Close the pool connection after running migrations
    poolForMigration.end();
  }
}

// Create the database and run migrations
createDatabase().then(() => runMigrations());

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL Database");
});

pool.on("error", (err: Error) => {
  console.error("Database connection error:", err);
});

const createTables = async () => {
  try {
    // Create Users Table (if not exists)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create Groceries Table (if not exists)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groceries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Create Orders Table (if not exists)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        grocery_id INT NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (grocery_id) REFERENCES groceries(id) ON DELETE CASCADE
      );
    `);
    console.log("Tables checked/created successfully");
  } catch (error) {
    console.error("Error creating tables", error);
  }
};

createTables();

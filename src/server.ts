import express from "express";
import dotenv from "dotenv";
import { pool } from "./config/database"; 
import { PoolClient } from "pg";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import routes from "./routes/routes";

pool.connect()
  .then((client: PoolClient) => {
    console.log("Connected to PostgreSQL Database");
    client.release(); 

    app.use("/api", routes);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error: Error) => {
    console.error("Database connection error:", error);
    process.exit(1); 
  });

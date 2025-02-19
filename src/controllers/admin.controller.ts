import { Request, Response } from "express";
import { pool } from "../config/database";

export const addGrocery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, stock } = req.body;
    const result = await pool.query(
      "INSERT INTO groceries (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
      [name, price, stock]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding grocery:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGrocery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const result = await pool.query(
      "UPDATE groceries SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *",
      [name, price, stock, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Grocery item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating grocery:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteGrocery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM groceries WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Grocery item not found" });
    }

    res.json({ message: "Grocery deleted", grocery: result.rows[0] });
  } catch (error) {
    console.error("Error deleting grocery:", error);
    res.status(500).json({ message: "Server error" });
  }
};

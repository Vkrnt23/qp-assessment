import { Request, Response } from "express";
import { pool } from "../config/database";

export const getGroceries = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM groceries");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching groceries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = (req as any).user?.id;

    if (!user_id) {
      res.status(401).json({ message: "Unauthorized: No user ID found in token" });
      return;
    }

    const { items } = req.body; // Expecting an array of { grocery_id, quantity }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Invalid request. 'items' should be a non-empty array" });
      return;
    }

    // Insert multiple items in a single query
    const values: any[] = [];
    const placeholders = items
      .map((item, index) => {
        values.push(user_id, item.grocery_id, item.quantity);
        return `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`;
      })
      .join(",");

    const query = `INSERT INTO orders (user_id, grocery_id, quantity) VALUES ${placeholders} RETURNING *`;

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Order placed successfully", orders: result.rows });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
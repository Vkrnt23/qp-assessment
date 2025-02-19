import { Router } from "express";
import { register, login } from "../controllers/auth.comtroller";
import { addGrocery, updateGrocery, deleteGrocery } from "../controllers/admin.controller";
import { getGroceries, placeOrder } from "../controllers/user.controller";
import { authenticateJWT, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// Auth Routes
router.post("/auth/register", register);
router.post("/auth/login", login);

// Admin Routes
router.post("/admin/grocery", authenticateJWT, isAdmin, addGrocery);
router.put("/admin/grocery/:id", authenticateJWT, isAdmin, updateGrocery);
router.delete("/admin/grocery/:id", authenticateJWT, isAdmin, deleteGrocery);

// User Routes
router.get("/user/groceries", authenticateJWT, getGroceries);
router.post("/user/order", authenticateJWT, placeOrder);

export default router;

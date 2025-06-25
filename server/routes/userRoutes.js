import express from "express";
import {
  deleteUser,
  insertUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/insert-user", insertUser);
router.put("/update-user", updateUser);
router.delete("/delete-user/:clerkUserId", deleteUser);
router.get("/:userId", getUser);

export default router;

import { Router } from "express";
import Controller from "../controller/controller.js";

const {
  login_post,
  admin_dashboard,
  login_get,
  create_student,
  create_parent,
  update_parent,
} = new Controller();

const router = Router();

// Student routes
router.post("/create-student", create_student);

// Parent routes
router.post("/create-parent", create_parent);
router.post("/update-parent", update_parent);

// Login routes
router.post("/login", login_post);
router.get("/login", login_get);

// Admin routes
router.get("/admin/dashboard", admin_dashboard);

export default router;

import { Router } from "express";
import Controller from "../controller/controller.js";

const {
  create_teacher,
  create_user,
  create_student,
  create_parent,
  update_parent,
  create_employee,
  update_employee,
  delete_user,
  login_post,
  login_get,
  admin_dashboard,
} = new Controller();

const router = Router();

// User routes
router.post("/user/create", create_user);
router.delete("/user/delete", delete_user);

// Teacher routes
router.post("/teacher/create", create_teacher);

// Student routes
router.post("/student/create", create_student);

// Employee routes
router.post("/employee/create", create_employee);
router.put("/employee/update", update_employee);

// Parent routes
router.post("/parent/create", create_parent);
router.put("/parent/update", update_parent);

// Login routes
router.post("/login", login_post);
router.get("/login", login_get);

// Admin routes
router.get("/admin/dashboard", admin_dashboard);

export default router;

import { Router } from "express";
import Controller from "../controller/controller.js";

const {
  login_post,
  admin_dashboard,
  login_get,
  create_student,
  create_guardian,
} = new Controller();

const router = Router();

router.post("/login", login_post);

router.post("/create-student", create_student);

router.post("/create-guardian", create_guardian);

router.get("/login", login_get);

router.get("/admin/dashboard", admin_dashboard);

export default router;

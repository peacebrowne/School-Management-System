import { Router } from "express";
import Controller from "../../controller/controller.js";

const { login_get, admin_dashboard } = new Controller();

const router = Router();

router.get("/login", login_get);
router.get("/admin/dashboard", admin_dashboard);

export default router;

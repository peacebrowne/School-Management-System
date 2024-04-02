import { Router } from "express";
import Handler from "../../handler.js";

const { login_get, admin_dashboard } = new Handler();

const router = Router();

router.get("/login", login_get);
router.get("/admin/dashboard", admin_dashboard);

export default router;

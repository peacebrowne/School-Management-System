import { Router } from "express";
import Controller from "../controller/controller.js";
import Validations from "../validation/validation.js";

const { login_post } = new Controller();
const { valid_email, valid_password } = new Validations();

const router = Router();

router.post("/login", login_post);

router.post("/valid-email", valid_email);

router.post("/valid-password", valid_password);

export default router;

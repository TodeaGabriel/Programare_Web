import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser
} from "../controllers/auth.controller.js";

const router = Router();

// HOME
router.get("/", (req, res) => {
    res.render("home");
});

// REGISTER PAGE
router.get("/register", (req, res) => {
    res.render("register");
});

// REGISTER ACTION
router.post("/register", registerUser);

// LOGIN PAGE
router.get("/login", (req, res) => {
    res.render("login");
});

// LOGIN ACTION
router.post("/login", loginUser);

// LOGOUT
router.get("/logout", logoutUser);

export default router;
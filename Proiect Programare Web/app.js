import express from "express";
import session from "express-session";

const app = express(); // creaza o aplicatie express

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

// EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

// declarare routes
app.use("/", authRoutes);
app.use("/dashboard", dashboardRoutes);

// exemolu de ruta: http://localhost:4000/login

export default app;

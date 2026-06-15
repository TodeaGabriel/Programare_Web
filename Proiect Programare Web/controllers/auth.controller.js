import bcrypt from "bcrypt";
import { User } from "../db/models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.send("Toate câmpurile sunt obligatorii");
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.send("Utilizatorul există deja");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        return res.redirect("/login");

    } catch (error) {
        console.error("Eroare la register:", error);
        return res.send("A apărut o eroare la înregistrare");
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send("Email și parola sunt obligatorii");
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.send("Utilizatorul nu există");
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.send("Parolă incorectă");
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.role = user.role;

        return res.redirect("/dashboard");

    } catch (error) {
        console.error("Eroare la login:", error);
        return res.send("A apărut o eroare la autentificare");
    }
};

const logoutUser = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Eroare la logout:", error);
            return res.send("Eroare la logout");
        }

        return res.redirect("/");
    });
};

export {
    registerUser,
    loginUser,
    logoutUser
};
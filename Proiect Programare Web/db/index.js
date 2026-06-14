import dotenv from "dotenv";
import connectDB from "./database.js";
import app from "../app.js";

dotenv.config({
    path: '.env'
});

const startServer = async () => {
    try {
        await connectDB();
        app.on("error", (error) => {
            console.error("Eroare la pornirea serverului:", error);
            throw error;
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Serverul rulează pe portul ${process.env.PORT || 8000}`);
        });
    } catch (error) {
        console.error("Eroare la pornirea serverului:", error);
        process.exit(1);
    }
};

startServer();
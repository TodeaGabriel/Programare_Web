import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URI}`)
        console.log(`MongoDB conectat: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Eroare la conectarea la MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;   
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        purchaseDate: {
            type: Date,
            default: Date.now
        },

        qrCode: String
    }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
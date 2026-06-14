import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        quantity: {
            type: Number,
            default: 1
        },

        totalPrice: Number,

        status: {
            type: String,
            enum: ["pending", "paid", "cancelled"],
            default: "paid"
        }
    }, 


    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);
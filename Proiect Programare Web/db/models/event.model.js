import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        artist: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        description: {
            type: String,
            trim: true,
            minlength: 10,
            maxlength: 200
        },

        date: {
            type: Date,
            required: true
        },

        venue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Venue",
            required: true
        },

        totalTickets: {
            type: Number,
            required: true
        },

        availableTickets: {
            type: Number,
            required: true
        },

        ticketPrice: {
            type: Number,
            required: true
        },

        imageUrl: {
            type: String,
            trim: true
        }
    }, 


    {
        timestamps: true
    }
);

export const Event = mongoose.model("Event", eventSchema);
import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },

        location: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 200
        },

        capacity: {
            type: Number,
            required: true,
            min: 100
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Venue = mongoose.model("Venue", venueSchema);
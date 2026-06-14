import mongooose from 'mongoose';

const venueSchema = new mongooose.Schema({
    
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
            minlength: 10,
            maxlength: 200
        },

        capacity: {
            type: Number,
            required: true,
            min: 100
        },
    }
);

export const Venue = mongooose.model("Venue", venueSchema);
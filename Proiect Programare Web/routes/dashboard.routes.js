import { Router } from "express";

import requireLogin from "../middleware/requireLogin.js";
import requireAdmin from "../middleware/requireAdmin.js";

import { Event } from "../db/models/event.model.js";
import { Venue } from "../db/models/venue.model.js";
import { Ticket } from "../db/models/ticket.model.js";

const router = Router();

// Toate rutele din dashboard sunt accesibile doar utilizatorilor logați
router.use(requireLogin);

// GET /dashboard
router.get("/", (req, res) => {
    res.render("dashboard/index", {
        username: req.session.username,
        role: req.session.role
    });
});

// GET /dashboard/events
// Accesibil user + admin
router.get("/events", async (req, res) => {
    try {
        const search = req.query.search || "";

        const filter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { artist: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const events = await Event.find(filter).populate("venue");

        res.render("dashboard/events", {
            events,
            search,
            role: req.session.role
        });

    } catch (error) {
        console.error("Eroare la afișarea evenimentelor:", error);
        res.send("Eroare la afișarea evenimentelor");
    }
});

// GET /dashboard/events/new
// Doar admin
router.get("/events/new", requireAdmin, async (req, res) => {
    try {
        const venues = await Venue.find();

        res.render("dashboard/add-event", {
            venues
        });

    } catch (error) {
        console.error("Eroare la formular eveniment:", error);
        res.send("Eroare la formular eveniment");
    }
});

// POST /dashboard/events
// Doar admin
router.post("/events", requireAdmin, async (req, res) => {
    try {
        const {
            title,
            artist,
            description,
            date,
            venue,
            totalTickets,
            ticketPrice,
            imageUrl
        } = req.body;

        await Event.create({
            title,
            artist,
            description,
            date,
            venue,
            totalTickets,
            availableTickets: totalTickets,
            ticketPrice,
            imageUrl
        });

        res.redirect("/dashboard/events");

    } catch (error) {
        console.error("Eroare la creare eveniment:", error);
        res.send("Eroare la creare eveniment");
    }
});

// GET /dashboard/venues/new
// Doar admin
router.get("/venues/new", requireAdmin, (req, res) => {
    res.render("dashboard/add-venue");
});

// POST /dashboard/venues
// Doar admin
router.post("/venues", requireAdmin, async (req, res) => {
    try {
        const { name, location, capacity } = req.body;

        await Venue.create({
            name,
            location,
            capacity
        });

        res.redirect("/dashboard/events/new");

    } catch (error) {
        console.error("Eroare la creare locație:", error);
        res.send("Eroare la creare locație");
    }
});

// GET /dashboard/events/:id
// Accesibil user + admin
router.get("/events/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("venue");

        if (!event) {
            return res.send("Evenimentul nu a fost găsit");
        }

        res.render("dashboard/event-details", {
            event,
            role: req.session.role
        });

    } catch (error) {
        console.error("Eroare la detalii eveniment:", error);
        res.send("Eroare la detalii eveniment");
    }
});

// POST /dashboard/events/:id/buy
// User + admin pot cumpăra, dar în practică userul normal va folosi asta
router.post("/events/:id/buy", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.send("Evenimentul nu există");
        }

        if (event.availableTickets <= 0) {
            return res.send("Nu mai sunt bilete disponibile");
        }

        await Ticket.create({
            owner: req.session.userId,
            event: event._id
        });

        event.availableTickets -= 1;
        await event.save();

        res.redirect("/dashboard/my-tickets");

    } catch (error) {
        console.error("Eroare la cumpărare bilet:", error);
        res.send("Eroare la cumpărare bilet");
    }
});

// GET /dashboard/my-tickets
// Accesibil user + admin
router.get("/my-tickets", async (req, res) => {
    try {
        const tickets = await Ticket.find({
            owner: req.session.userId
        }).populate({
            path: "event",
            populate: {
                path: "venue"
            }
        });

        res.render("dashboard/my-tickets", {
            tickets
        });

    } catch (error) {
        console.error("Eroare la afișare bilete:", error);
        res.send("Eroare la afișare bilete");
    }
});

export default router;
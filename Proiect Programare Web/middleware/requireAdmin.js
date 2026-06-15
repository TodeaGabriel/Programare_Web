const requireAdmin = (req, res, next) => {
    if (req.session.role !== "admin") {
        return res.send("Acces interzis. Doar administratorul poate accesa această pagină.");
    }

    next();
};

export default requireAdmin;
// middleware/logger.js
const logger = (req, res, next) => {
    const userEmail = req.session && req.session.user ? req.session.user.email : "anonim";
    console.log(`${req.method} ${req.url} - user: <${userEmail}>`);
    next(); // Trecem la următorul middleware/rută
};

module.exports = logger;
// middleware/requireLogin.js
const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next(); // Utilizatorul este logat, poate merge mai departe
    } else {
        res.redirect('/login'); // Nu e logat, îl trimitem la login
    }
};

module.exports = requireLogin;
// routes/auth.js
const express = require('express');
const router = express.Router();
const UserDB = require('../db/users');

// --- RUTA DE ÎNREGISTRARE ---
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { email, password, preferintaTema } = req.body; // preferintaTema vine din formular
    
    // Verificăm dacă userul există deja (opțional, dar recomandat)
    if(UserDB.findByEmail(email)) {
        return res.status(400).send("Eroare: Acest email este deja folosit. <a href='/login'>Mergi la Login</a>");
    }

    const newUser = await UserDB.register(email, password);
    req.session.user = newUser; // 1. Pornim sesiunea
    res.cookie('tema', preferintaTema || 'light'); // 2. Setăm cookie-ul propriu
    
    res.redirect('/biblioteca'); // 3. Redirect la zona protejată
});

// --- RUTA DE LOGIN ---
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = UserDB.findByEmail(email);
    
    // Verificăm dacă userul există și dacă parola (hash-ul) se potrivește
    if (user && await UserDB.comparePasswords(password, user.password)) {
        req.session.user = user;
        // La login refolosim o temă default dacă nu există deja un cookie
        res.cookie('tema', req.cookies.tema || 'light'); 
        res.redirect('/biblioteca');
    } else {
        res.status(401).send("Credențiale incorecte! <a href='/login'>Încearcă din nou</a>");
    }
});

// --- RUTA DE LOGOUT ---
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Distruge sesiunea și redirectează la home
    });
});

module.exports = router;
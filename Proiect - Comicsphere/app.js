require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

// Importăm modulele noastre
const logger = require('./middleware/logger');
const requireLogin = require('./middleware/requireLogin');
const comics = require('./db/comics'); // Lista de benzi desenate

const app = express();

// Configurare EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware-uri globale
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 ore
}));

// Activăm logger-ul propriu pentru TOATE rutele
app.use(logger);

// --- RUTE PUBLICE ---

// Importăm rutele de autentificare
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

app.get('/', (req, res) => {
    // Verificăm dacă există un cookie de preferință (cerința 2.5)
    const tema = req.cookies.tema || 'light';
    res.render('home', { user: req.session.user, tema: tema });
});

// Aici vor veni rutele de login/register pe care le facem la pasul următor

// --- RUTE PROTEJATE (Zona ComicSphere) ---

// Aplicăm requireLogin pe toate rutele care încep cu /biblioteca
app.get('/biblioteca', requireLogin, (req, res) => {
    // Incrementăm numărul de vizite în sesiune (cerința 2.3.3)
    req.session.views = (req.session.views || 0) + 1;

    res.render('biblioteca', {
        user: req.session.user,
        listaComics: comics,
        vizite: req.session.views,
        tema: req.cookies.tema || 'light'
    });
});

// A doua rută protejată: Detalii despre un comic specific (cerința 2.2 /zona-voastra/subruta)
app.get('/biblioteca/detalii/:id', requireLogin, (req, res) => {
    const comic = comics.find(c => c.id == req.params.id);
    if (!comic) return res.status(404).send("Comic negăsit");
    
    res.render('detalii', { comic });
});

// Pornire server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
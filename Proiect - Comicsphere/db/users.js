const bcrypt = require('bcrypt');

// Baza de date in-memory
let users = []; 

const UserDB = {
    // Funcție pentru înregistrare cu hashing
    register: async (email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now(), email, password: hashedPassword };
        users.push(newUser);
        return newUser;
    },
    // Funcție pentru login
    findByEmail: (email) => {
        return users.find(u => u.email === email);
    },
    comparePasswords: async (inputPassword, storedHash) => {
        return await bcrypt.compare(inputPassword, storedHash);
    }
};

module.exports = UserDB;
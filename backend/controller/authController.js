const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Register a new user
exports.register = async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) return res.status(400).json({ message: "All fields required" });

    try {
        const [existing] = await db.promise().query("SELECT * FROM Users WHERE email = ?", [email]);
        if (existing.length) return res.status(400).json({ message: "Email already exists" });

        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.promise().query(
            "INSERT INTO Users (email, password_hash, username) VALUES (?, ?, ?)", 
            [email, hash, username]
        );

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    try {
        const [users] = await db.promise().query("SELECT * FROM Users WHERE email = ?", [email]);
        if (!users.length) return res.status(400).json({ message: "Invalid email or password" });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

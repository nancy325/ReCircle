const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

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

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.promise().query("SELECT id, email, username, profile_image FROM Users WHERE id = ?", [req.user.id]);
        if (!users.length) return res.status(404).json({ message: "User not found" });
        res.json(users[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update user profile image
exports.updateProfileImage = async (req, res) => {
    const { profile_image } = req.body;
    if (!profile_image) return res.status(400).json({ message: "Profile image URL required" });
    try {
        await db.promise().query("UPDATE Users SET profile_image = ? WHERE id = ?", [profile_image, req.user.id]);
        res.json({ message: "Profile image updated" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateUserProfile = async (req, res) => {
    const { email, username, profile_image } = req.body;

    if (!email && !username && profile_image === undefined) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        // Check for email/username conflict
        if (email || username) {
            const conditions = [];
            const params = [];

            if (email) {
                conditions.push('email = ?');
                params.push(email);
            }
            if (username) {
                conditions.push('username = ?');
                params.push(username);
            }
            params.push(req.user.id); // exclude current user

            const [conflicts] = await db.execute(
                `SELECT id FROM Users WHERE (${conditions.join(' OR ')}) AND id != ?`,
                params
            );

            if (conflicts.length > 0) {
                return res.status(409).json({ message: 'Email or username already in use' });
            }
        }

        // Build dynamic update
        const fields = [];
        const values = [];

        if (email) { fields.push('email = ?'); values.push(email); }
        if (username) { fields.push('username = ?'); values.push(username); }
        if (profile_image !== undefined) { fields.push('profile_image = ?'); values.push(profile_image); }

        values.push(req.user.id);

        const sql = `UPDATE Users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        await db.execute(sql, values);

        // Fetch updated user
        const [rows] = await db.promise().query(
            'SELECT id, email, username, profile_image, created_at, updated_at FROM Users WHERE id = ?',
            [req.user.id]
        );

        res.json({
            message: 'Profile updated successfully',
            user: rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

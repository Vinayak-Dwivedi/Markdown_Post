const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");

// Register user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        function (err) {
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
              return res.status(400).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Error creating user" });
          }

          const token = jwt.sign(
            { id: this.lastID, email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.status(201).json({ token });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Login user
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {
          if (err) {
            return res.status(500).json({ error: "Error finding user" });
          }

          if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.json({ token });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;

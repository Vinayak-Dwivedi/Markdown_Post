const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const db = require("../config/database");

// Get all posts for the authenticated user
router.get("/", auth, (req, res) => {
  db.all(
    "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, posts) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching posts" });
      }
      res.json(posts);
    }
  );
});

// Get a single post
router.get("/:id", auth, (req, res) => {
  db.get(
    "SELECT * FROM posts WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    (err, post) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching post" });
      }
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    }
  );
});

// Create a new post
router.post(
  "/",
  [auth, body("title").trim().notEmpty(), body("content").trim().notEmpty()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content } = req.body;

      db.run(
        "INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)",
        [req.user.id, title, content],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Error creating post" });
          }

          db.get(
            "SELECT * FROM posts WHERE id = ?",
            [this.lastID],
            (err, post) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error fetching created post" });
              }
              res.status(201).json(post);
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Update a post
router.put(
  "/:id",
  [auth, body("title").trim().notEmpty(), body("content").trim().notEmpty()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content } = req.body;

      db.run(
        `UPDATE posts 
       SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND user_id = ?`,
        [title, content, req.params.id, req.user.id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Error updating post" });
          }
          if (this.changes === 0) {
            return res
              .status(404)
              .json({ error: "Post not found or unauthorized" });
          }

          db.get(
            "SELECT * FROM posts WHERE id = ?",
            [req.params.id],
            (err, post) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error fetching updated post" });
              }
              res.json(post);
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete a post
router.delete("/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM posts WHERE id = ? AND user_id = ?",
    [req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error deleting post" });
      }
      if (this.changes === 0) {
        return res
          .status(404)
          .json({ error: "Post not found or unauthorized" });
      }
      res.json({ message: "Post deleted successfully" });
    }
  );
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // JWT auth middleware
const Book = require("../models/Book");
const Review = require("../models/Review");

// GET /api/profile
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const books = await Book.find({ addedBy: userId });
    const reviews = await Review.find({ userId }).populate("bookId", "title");
    res.json({ books, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;

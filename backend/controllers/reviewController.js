const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Book = require('../models/Book');

const addReview = asyncHandler(async (req, res) => {
  const { rating, reviewText } = req.body;
  const book = await Book.findById(req.params.bookId);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  let review = await Review.findOne({ bookId: req.params.bookId, userId: req.user._id });
  if (review) {
    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();
    return res.json(review);
  }
  review = await Review.create({ bookId: req.params.bookId, userId: req.user._id, rating, reviewText });
  res.status(201).json(review);
});

const editReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (!review.userId.equals(req.user._id)) { res.status(403); throw new Error('Not allowed'); }
  review.rating = req.body.rating ?? review.rating;
  review.reviewText = req.body.reviewText ?? review.reviewText;
  await review.save();
  res.json(review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (!review.userId.equals(req.user._id)) { res.status(403); throw new Error('Not allowed'); }
  await review.remove();
  res.json({ message: 'Review deleted' });
});

module.exports = { addReview, editReview, deleteReview };

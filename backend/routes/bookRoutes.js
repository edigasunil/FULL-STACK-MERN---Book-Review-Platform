const express = require('express');
const { createBook, updateBook, deleteBook, getBooks, getBookById, getRatingDistribution } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

// rating distribution
router.get('/:id/ratings/distribution', getRatingDistribution);

module.exports = router;

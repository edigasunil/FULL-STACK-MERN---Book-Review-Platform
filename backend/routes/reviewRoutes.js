const express = require('express');
const { addReview, editReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:bookId', protect, addReview);
router.put('/:id', protect, editReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;

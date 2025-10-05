const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');

const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json(book);
});

const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  if (!book.addedBy.equals(req.user._id)) { res.status(403); throw new Error('Not allowed'); }
  Object.assign(book, req.body);
  await book.save();
  res.json(book);
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  if (!book.addedBy.equals(req.user._id)) { res.status(403); throw new Error('Not allowed'); }
  await Review.deleteMany({ bookId: book._id });
  await book.remove();
  res.json({ message: 'Book deleted' });
});

// Helper to attach ratings map to books array
async function attachRatings(books) {
  if (!books || books.length === 0) return [];
  const bookIds = books.map(b => mongoose.Types.ObjectId(b._id));
  const ratings = await Review.aggregate([
    { $match: { bookId: { $in: bookIds } } },
    { $group: { _id: '$bookId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const map = {};
  ratings.forEach(r => { map[r._id.toString()] = r; });
  return books.map(b => ({
    _id: b._id,
    title: b.title,
    author: b.author,
    description: b.description,
    genre: b.genre,
    year: b.year,
    addedBy: b.addedBy,
    avgRating: map[b._id]?.avgRating ? Number(map[b._id].avgRating.toFixed(2)) : null,
    ratingsCount: map[b._id]?.count || 0
  }));
}

const getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 5;
  const search = req.query.search ? {
    $or: [
      { title: { $regex: req.query.search, $options: 'i' } },
      { author: { $regex: req.query.search, $options: 'i' } }
    ]
  } : {};

  const genreFilter = req.query.genre ? { genre: req.query.genre } : {};
  const filter = { ...search, ...genreFilter };

  // If sort=rating we need to aggregate; otherwise simple find with optional sort by year
  const sort = req.query.sort || '';
  if (sort === 'rating') {
    // aggregate books with avg rating, then sort, then paginate
    const agg = [
      { $match: filter },
      { $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'bookId',
          as: 'reviews'
        }
      },
      { $addFields: {
          avgRating: { $avg: '$reviews.rating' },
          ratingsCount: { $size: '$reviews' }
        }
      },
      { $sort: { avgRating: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize }
    ];
    const booksAgg = await Book.aggregate(agg);
    const total = await Book.countDocuments(filter);
    // normalize avgRating to 2 decimals
    const books = booksAgg.map(b => ({
      _id: b._id,
      title: b.title,
      author: b.author,
      description: b.description,
      genre: b.genre,
      year: b.year,
      addedBy: b.addedBy,
      avgRating: b.avgRating ? Number(Number(b.avgRating).toFixed(2)) : null,
      ratingsCount: b.ratingsCount || 0
    }));
    return res.json({ books, page, pages: Math.ceil(total / pageSize), total });
  } else {
    const sortOption = sort === 'year' ? { year: -1 } : { createdAt: -1 };
    const total = await Book.countDocuments(filter);
    const booksRaw = await Book.find(filter)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOption);
    const books = await attachRatings(booksRaw);
    return res.json({ books, page, pages: Math.ceil(total / pageSize), total });
  }
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
  if (!book) { res.status(404); throw new Error('Book not found'); }
  const reviews = await Review.find({ bookId: book._id }).populate('userId', 'name');
  const agg = await Review.aggregate([
    { $match: { bookId: book._id } },
    { $group: { _id: '$bookId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const avgRating = agg[0] ? Number(agg[0].avgRating.toFixed(2)) : null;
  res.json({ book, reviews, avgRating, reviewsCount: agg[0] ? agg[0].count : 0 });
});

// New endpoint: rating distribution for a book
const getRatingDistribution = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  const dist = await Review.aggregate([
    { $match: { bookId: book._id } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
  // convert to 1-5 keys
  const result = { '5':0,'4':0,'3':0,'2':0,'1':0 };
  dist.forEach(d => { result[String(d._id)] = d.count; });
  res.json({ distribution: result });
});

module.exports = { createBook, updateBook, deleteBook, getBooks, getBookById, getRatingDistribution };

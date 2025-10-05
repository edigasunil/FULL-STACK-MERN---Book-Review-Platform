import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [data, setData] = useState({ books: [], reviews: [] });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <h2 className="text-xl font-semibold mt-4">My Books</h2>
      {data.books.length === 0 ? (
        <p>No books added yet.</p>
      ) : (
        <ul className="list-disc ml-6">
          {data.books.map((book) => (
            <li key={book._id}>
              {book.title} - {book.author}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mt-4">My Reviews</h2>
      {data.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="list-disc ml-6">
          {data.reviews.map((review) => (
            <li key={review._id}>
              <strong>{review.bookId.title}:</strong> {review.reviewText} ({review.rating}⭐)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Card({ book }) {
  const navigate = useNavigate();

  const go = () => {
    const id = book.book_id ?? book.id;
    navigate(`/book/${id}`, { state: { book } });
  }

  return (
    <div
      onClick={go}
      onKeyDown={(e) => { if (e.key === 'Enter') go(); }}
      role="button"
      tabIndex={0}
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-80 w-48 cursor-pointer"
    >
      <img
        src={book.image_url || "https://via.placeholder.com/150"}
        alt={book.title}
        className="w-full h-48 object-cover"
      />

      <div className="px-4 flex-1 flex flex-col justify-center">
        <h3 className="text-lg font-semibold mb-1 truncate">{book.original_title || book.title}</h3>
        <p className="text-gray-600 mb-2 text-sm overflow-hidden">{book.authors}</p>
        <p className="text-yellow-500 font-bold">Rating: {book.average_rating}</p>
      </div>
    </div>
  )
}

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 56;
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(null); // null = no search applied

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8000/books");
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, []);

  const displayedBooks = filteredBooks || books;

  // Debounced client-side filtering: filter as the user types
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const timer = setTimeout(() => {
      if (!q) {
        setFilteredBooks(null);
        setCurrentPage(1);
        return;
      }
      const results = books.filter((b) => {
        const title = (b.original_title || b.title || "").toString().toLowerCase();
        const authors = (b.authors || "").toString().toLowerCase();
        return title.includes(q) || authors.includes(q);
      });
      setFilteredBooks(results);
      setCurrentPage(1);
    }, 250); // 250ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, books]);

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredBooks(null);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Search bar (top center) */}
      <div className="flex justify-center my-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author"
            className="px-3 py-2 border rounded-md w-96 focus:outline-none"
            aria-label="Search books by title or author"
          />
          <button
            onClick={clearSearch}
            className="px-3 py-2 bg-gray-200 rounded-md ml-2"
            aria-label="Clear search"
          >
            Clear
          </button>
        </div>
      </div>

      <ul className="my-5">
        <div className="flex justify-center rounded-4xl flex-wrap gap-6 p-4">
          {books.length === 0 && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white shadow-lg rounded-lg overflow-hidden animate-pulse flex flex-col h-96 w-48"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4 flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto" />
                  </div>
                </div>
              ))}
            </>
          )}

          {books.length > 0 && displayedBooks.length === 0 && (
            <div className="w-full text-center text-gray-600 mb-4">No results found for "{searchQuery}"</div>
          )}

          {displayedBooks
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map((book, index) => (
              <Card key={book.book_id ?? index} book={book} />
            ))}
        </div>
        {/* Pagination controls */}
        {displayedBooks.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center space-x-3 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              aria-label="Previous page"
            >
              Prev
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.ceil(displayedBooks.length / ITEMS_PER_PAGE) }).map((_, i) => {
                const page = i + 1;
                // show only nearby pages to avoid huge lists
                if (Math.abs(page - currentPage) > 4 && page !== 1 && page !== Math.ceil(displayedBooks.length / ITEMS_PER_PAGE)) {
                  // Render ellipsis for gaps
                  if (page === currentPage - 5 || page === currentPage + 5) {
                    return (
                      <span key={`dots-${page}`} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(displayedBooks.length / ITEMS_PER_PAGE), p + 1))}
              disabled={currentPage === Math.ceil(displayedBooks.length / ITEMS_PER_PAGE)}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}

      </ul>
    </div>
  );
};

export default BookList;

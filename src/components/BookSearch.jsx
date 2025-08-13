import { useState } from "react";
import { db, collection, addDoc, serverTimestamp } from "../firebase";

export default function BookSearch({ onBookSaved }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const apiKey = ""; // optional
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10${apiKey ? `&key=${apiKey}` : ""}`
      );
      const data = await response.json();

      const books = (data.items || []).map(item => {
        const info = item.volumeInfo;
        return {
          id: item.id,
          title: info.title || "Untitled",
          authors: info.authors || [],
          publishedDate: info.publishedDate || "N/A",
          pageCount: info.pageCount || "N/A",
          thumbnail: info.imageLinks?.thumbnail || "https://via.placeholder.com/128x195?text=No+Cover",
          averageRating: info.averageRating || "N/A",
          description: info.description || "No description available",
        };
      });

      setResults(books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }

    setLoading(false);
  };

  const saveBook = async (book) => {
    try {
      await addDoc(collection(db, "books"), {
        ...book,
        status: "Save",
        timestamp: serverTimestamp(),
      });
      alert("Book saved to Next Books");
      if (onBookSaved) onBookSaved(); // Refresh NextBooks if needed
    } catch (error) {
      console.error(error);
      alert("Failed to save book.");
    }
  };

  return (
    <div className="searched-books">
      <div className="search-box">
        <input
          type="text"
          value={query}
          placeholder="Search by title, author, or ISBN"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {loading && <p>Searching...</p>}
      {!loading && results.length === 0 && searched && <p>No results found.</p>}

      <div className="search-results">
        {results.map(book => (
          <div key={book.id} className="book">
            <div className="cover">
                <img src={book.thumbnail} alt={book.title} />
            </div>
            <div className="book">
                <p className="title">{book.title}</p>
                {book.authors?.length > 0 && <p className="author">{book.authors.join(", ")}</p>}
                <p className="pages">{book.pageCount} pages</p>
                <p className="description">{book.description}</p>
                <div className="buttons">
                    <button className="save" onClick={() => saveBook(book)}>Save</button>
                </div>
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}

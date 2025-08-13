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
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          placeholder="Search by title, author, or ISBN"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={searchBooks} style={{ padding: "0.5rem 1rem" }}>Search</button>
      </div>

      {loading && <p>Searching...</p>}
      {!loading && results.length === 0 && searched && <p>No results found.</p>}

      <div style={{ display: "grid", gap: "1rem" }}>
        {results.map(book => (
          <div key={book.id} style={{ display: "flex", gap: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "4px", alignItems: "flex-start" }}>
            <img src={book.thumbnail} alt={book.title} style={{ width: 128, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <h2>{book.title}</h2>
              {book.authors.length > 0 && <p><strong>Authors:</strong> {book.authors.join(", ")}</p>}
              <p><strong>Published:</strong> {book.publishedDate}</p>
              <p><strong>Pages:</strong> {book.pageCount}</p>
              {book.averageRating && <p><strong>Average Rating:</strong> {book.averageRating}</p>}
              {book.description && <p>{book.description.length > 200 ? book.description.substring(0, 200) + "…" : book.description}</p>}
              <button onClick={() => saveBook(book)}>Save to Next Books</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

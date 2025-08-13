import { useEffect, useState } from "react";
import { db, collection, getDocs, query, where, addDoc, serverTimestamp, updateDoc, doc } from "../firebase";
import BookSearch from "../BookSearch";

export default function NextBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    const q = query(collection(db, "books"), where("status", "==", "Save"));
    const snapshot = await getDocs(q);
    setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const updateBookStatus = async (bookId, newStatus) => {
    const bookRef = doc(db, "books", bookId);
    if (newStatus === "Read") {
      const readDate = prompt("Enter the date you finished reading (YYYY-MM-DD):");
      if (!readDate) return;
      await updateDoc(bookRef, { status: newStatus, readDate, timestamp: serverTimestamp() });
    } else {
      await updateDoc(bookRef, { status: newStatus, timestamp: serverTimestamp() });
    }
    fetchBooks();
  };

  const BookCard = ({ book }) => (
    <div style={{ display: "flex", gap: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "4px" }}>
      <img src={book.thumbnail} alt={book.title} style={{ width: 128, objectFit: "cover" }} />
      <div>
        <h2>{book.title}</h2>
        {book.authors?.length > 0 && <p><strong>Authors:</strong> {book.authors.join(", ")}</p>}
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <button onClick={() => updateBookStatus(book.id, "Reading")}>Mark Reading</button>
          <button onClick={() => updateBookStatus(book.id, "Read")}>Mark Read</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Next Books</h2>
      {loading ? <p>Loading...</p> : books.length === 0 ? <p>No next books saved.</p> : books.map(book => <BookCard key={book.id} book={book} />)}
      <hr style={{ margin: "2rem 0" }} />
      <h2>Search for New Books</h2>
      <BookSearch onBookSaved={fetchBooks} />
    </div>
  );
}

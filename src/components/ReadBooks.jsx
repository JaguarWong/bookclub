import { useEffect, useState } from "react";
import { db, collection, getDocs, query, where, orderBy } from "../firebase";

export default function ReadBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const q = query(collection(db, "books"), where("status", "==", "Read"), orderBy("readDate", "desc"));
      const snapshot = await getDocs(q);
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const BookCard = ({ book }) => (
    <div style={{ display: "flex", gap: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "4px" }}>
      <img src={book.thumbnail} alt={book.title} style={{ width: 128, objectFit: "cover" }} />
      <div>
        <h2>{book.title}</h2>
        {book.authors?.length > 0 && <p><strong>Authors:</strong> {book.authors.join(", ")}</p>}
        <p><strong>Read on:</strong> {book.readDate}</p>
      </div>
    </div>
  );

  return (
    <div>
      {loading ? <p>Loading...</p> : books.length === 0 ? <p>No books read yet.</p> : books.map(book => <BookCard key={book.id} book={book} />)}
    </div>
  );
}

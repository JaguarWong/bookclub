import { useEffect, useState } from "react";
import { db, collection, getDocs, query, where, updateDoc, doc, serverTimestamp, deleteDoc } from "../firebase";

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

    const deleteBook = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await deleteDoc(doc(db, "books", bookId));
            fetchBooks(); // Refresh the list
        } catch (error) {
            console.error("Failed to delete book:", error);
            alert("Failed to delete book.");
        }
    };

    const BookCard = ({ book }) => (
        <div key={book.id} className="book">
            <div className="cover">
                <img src={book.thumbnail} alt={book.title} />
            </div>
            <div>
                <p className="title">{book.title}</p>
                {book.authors?.length > 0 && <p className="author">{book.authors.join(", ")}</p>}
                <p className="pages">{book.pageCount} pages</p>
                <p className="description">{book.description}</p>
                <div className="buttons">
                    <button className="read" onClick={() => updateBookStatus(book.id, "Reading")}>Read Book</button>
                    <button className="delete" onClick={() => deleteBook(book.id)}>Delete</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="future-books">
            <p className="heading">Suggested Future Books</p>
            {loading ? <p>Loading...</p> : books.length === 0 ? <p>No next books saved.</p> : books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
    );
}

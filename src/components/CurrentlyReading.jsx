import { useEffect, useState } from "react";
import { db, collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from "../firebase";

export default function CurrentlyReading() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            const q = query(collection(db, "books"), where("status", "==", "Reading"));
            const snapshot = await getDocs(q);
            const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(booksData);
            setLoading(false);
        };
        fetchBooks();
    }, []);

    const markRead = async (bookId) => {
        const readDate = prompt("Enter the date you finished reading (YYYY-MM-DD):");
        if (!readDate) return;

        const bookRef = doc(db, "books", bookId);
        await updateDoc(bookRef, { status: "Read", readDate, timestamp: serverTimestamp() });

        setBooks(prevBooks => prevBooks.filter(book => book.docId !== bookId));
    };

    if (loading) return <p>Loading...</p>;
    if (books.length === 0) return <p>No books currently reading.</p>;

    return (
        <div className="currently-reading">
            {books.map(book => (
                <div key={book.docId} className="book">
                    <div className="cover">
                        <img src={book.thumbnail} alt={book.title} />
                    </div>
                    <div>
                        <p className="title">{book.title}</p>
                        {book.authors?.length > 0 && <p className="author">{book.authors.join(", ")}</p>}
                        <p className="pages">{book.pageCount} pages</p>
                        <p className="description">{book.description}</p>
                        <button className="read" onClick={() => markRead(book.docId)}>Read</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

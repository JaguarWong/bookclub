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
        <div key={book.id} className="book">
            <div className="cover">
                <img src={book.thumbnail} alt={book.title} />
            </div>
            <div>
                <p className="title">{book.title}</p>
                {book.authors?.length > 0 && <p className="author">{book.authors.join(", ")}</p>}
                <p className="pages">{book.pageCount} pages</p>
                <p className="read-date">Finished on {book.readDate}</p>
                <p className="description">{book.description}</p>
            </div>
        </div>
    );

    return (
        <div className="read-books">
            {loading ? <p>Loading...</p> : books.length === 0 ? <p>No books read yet.</p> : books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
    );
}

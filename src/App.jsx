import { useState } from "react";
import CurrentlyReading from "./components/CurrentlyReading";
import ReadBooks from "./components/ReadBooks";
import NextBooks from "./components/NextBooks";
import BookSearch from "./components/BookSearch";

export default function App() {
  const [page, setPage] = useState("currentlyReading");

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h1>My Book Club</h1>

      <nav style={{ marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setPage("currentlyReading")}>Currently Reading</button>
        <button onClick={() => setPage("readBooks")}>Previously Read</button>
        <button onClick={() => setPage("nextBooks")}>Next Books</button>
        <button onClick={() => setPage("search")}>Search Books</button>
      </nav>

      {page === "currentlyReading" && <CurrentlyReading />}
      {page === "readBooks" && <ReadBooks />}
      {page === "nextBooks" && <NextBooks />}
      {page === "search" && <BookSearch />}
    </div>
  );
}

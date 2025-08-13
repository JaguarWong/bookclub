import { useState } from "react";
import CurrentlyReading from "./components/CurrentlyReading";
import ReadBooks from "./components/ReadBooks";
import NextBooks from "./components/NextBooks";
import BookSearch from "./components/BookSearch";

export default function App() {
  const [page, setPage] = useState("currentlyReading");

  return (
    <div>
      <p className="app-title">Book Club Tracker</p>

      <nav className="navbar">
        <button onClick={() => setPage("currentlyReading")}>Currently Reading</button>
        <button onClick={() => setPage("readBooks")}>Previously Read</button>
        <button onClick={() => setPage("nextBooks")}>Next Book Ideas</button>
        <button onClick={() => setPage("search")}>Search</button>
      </nav>

      {page === "currentlyReading" && <CurrentlyReading />}
      {page === "readBooks" && <ReadBooks />}
      {page === "nextBooks" && <NextBooks />}
      {page === "search" && <BookSearch />}
    </div>
  );
}

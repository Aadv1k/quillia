import "./css/main.css";
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx"
import Book from "./Book.jsx"

export default function App() {
  let [books, setBooks] = useState(null);

  /*
  useEffect(() => {
    fetch("http://localhost:8080/api/books")
    .then(res => res.json())
    .then(data => setBooks(data))
  }, [])
  */

  let data =  [{"id":"0e1aa9df35","userid":"3701ced127","author":"Unknown","signature":"4fc52163eb83d2996c60f62a37449bfc","title":"9781524704551","path":"https://res.cloudinary.com/dbloby3uq/raw/upload/v1680867902/4fc52163eb83d2996c60f62a37449bfc.epub","cover":""}]

  return (
    <>
    <Navbar />
    <section className="books">
      <Book data={data[0]}/>
    </section>
    </>
  )
}

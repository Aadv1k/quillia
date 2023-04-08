import "./css/main.css";
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Login from "./Login.jsx";
import Book from "./Book.jsx";
import "./App.css";

import UserContext from "./UserContext.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const setCurrentUserToValue = (value) => setCurrentUser(value);

  useEffect(() => {
    fetch("http://localhost:4000/api/books")
      .then((res) => res.json())
      .then(data => {
        setBookData(data);
      });
  }, []);

  if (currentUser) {
    fetch("http://localhost:4000/api/issues", {
      method: "GET",
      mode: "cors",
      headers: {"Authorization": `Bearer ${currentUser.token}`}
    })
      .then(res => res.json())
      .then(setIssueData)
  }


  return (
    <UserContext.Provider value={[currentUser, setCurrentUserToValue]}>
      <Navbar />
      <section className="max-w-5xl mx-auto px-4 gap-4 grid grid-cols-1 md:grid-cols-2">
        {!currentUser && (
          <div>
            <h2 className="font-serif">Login/Signup</h2>
            <Login />
          </div>
        )}

        <div>
          <h2 className="font-serif mb-4">Latest</h2>
          {bookData?.[bookData.length - 1] && <Book data={bookData[bookData.length - 1]} />}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 my-4">
        <h2 className="font-serif mb-4">Library</h2>
        <div className="grid gap-y-6 grid-cols-1 md:grid-cols-2">
          {
            bookData.slice(0, -1).map((e, i) => {
              let issued 
              if (currentUser != null) {
                issued = issueData.find(e => e.bookid === e.id) ? true : false;
              }
              return <Book key={i} data={e} issued={issued}/>
            })
          }
        </div>
      </section>
    </UserContext.Provider>
  );
}

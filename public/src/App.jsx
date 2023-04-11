import "./css/main.css";
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import Login from "./Login.jsx";
import Library from "./Library.jsx";
import "./App.css";
import { Route, Router, Switch, useLocation} from 'wouter';
import UserContext from "./UserContext.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [bookData, setBookData] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const setCurrentUserToValue = (value) => setCurrentUser(value);
  const [_a, navigate] = useLocation();


  const fetchIssuesFromAPI = (currentUser) => {
    let localIssueData = JSON.parse(localStorage.getItem("issues"));

    fetch("/api/issues", {
      headers: {
        "Authorization": "Bearer " + JSON.parse(currentUser).token,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (localIssueData !== data) {
          localStorage.setItem("issues", JSON.stringify(
            data.filter(
              (e) => e.userid == currentUser.id)
            )
          );
          setIssueData(data);
        }
      });
  }

  const fetchBooksFromAPI = () => {
    let localBookData = JSON.parse(localStorage.getItem("books"));

    fetch("http://localhost:4000/api/books", { })
      .then((res) => res.json())
      .then((data) => {
        if (localBookData !== data) {
          localStorage.setItem("books", JSON.stringify(data));
          setBookData(data);
        }
      });


  }

  useEffect(() => {
    let localBookData = JSON.parse(localStorage.getItem("books"));
    let localIssueData = JSON.parse(localStorage.getItem("issues"));

    let storedUser = localStorage.getItem("Token");

    if (storedUser) {
      setCurrentUserToValue(storedUser);
      fetchIssuesFromAPI(storedUser);
    }

    if (localBookData) setBookData(localBookData);
    if (localIssueData) setIssueData(localIssueData);

    fetchBooksFromAPI();
  }, []);

  return (
    <UserContext.Provider value={[currentUser, setCurrentUserToValue]}>
      <Navbar fetchBooks={fetchBooksFromAPI} />
      <Router>
        <Switch>
          <Route path="/login">
            <section className="login px-4 mx-auto my-2 max-w-5xl grid grid-cols-1 gap-4">
              <div>
                <h2 className="font-serif">Login/Sign Up</h2>
                <Login />
              </div>
            </section>
          </Route>

          <Route path="/logout">
            {() => {
              localStorage.removeItem('Token');
              navigate("/");
            }}
          </Route>

          <Route>

            <Library 
              bookData={bookData} 
              issueData={issueData}
            />

          </Route>
        </Switch>

      </Router>


    </UserContext.Provider>
  );
}

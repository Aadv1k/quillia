import { Book, Bookmark } from "react-bootstrap-icons";
import { useContext, useState, useRef} from "react";
import UserContext from "./UserContext.js";
import { Link } from "wouter";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { CustomToast } from "./Toast.jsx";

export default function Navbar(props) {
  let [currentUser, setCurrentUser] = useContext(UserContext);
  let [isModalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState({});
  const [isToastShown, setShowToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);


  return (
    <nav className="flex justify-center flex-col items-center px-4 py-4 gap-3 max-w-5xl mx-auto md:flex-row">
      <Link
        to="/"
        className="nav__title text-4xl font-serif text-black no-underline"
      >
        Quillia
      </Link>

      {Object.keys(error).length !== 0 &&
      <CustomToast 
        title={error.error}
        body={error.message}
        visible={isToastShown}
        setVisible={setShowToast}
      />
      }


      {isModalVisible && currentUser && (
        <Modal show={isModalVisible} onHide={() => setModalVisible(false)} backdrop="static">

          <Modal.Header closeButton>
            <Modal.Title>Publish any <code>epub</code></Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form ref={formRef} id="epubForm" onSubmit={(e) => {
                e.preventDefault();
                let form = new FormData(e.target);
                let postData = form.get("epubDocument");

                if (postData.size === 0 || postData.type !== "application/epub+zip") {
                  setError({
                    error: "file-not-valid",
                    message: "the file is not a valid epub document",
                  })
                  setShowToast(true);
                  return;
                }

                let user = JSON.parse(currentUser);
                setIsLoading(true);

                fetch("/api/books", {
                  method: "POST",
                  headers: {
                    "Authorization": "Bearer " + user.token
                  },
                  body: postData
                }).then(res => res.json())
                  .then(data => {
                    if (data.error) {
                      setError(data);
                      setShowToast(true);
                      setIsLoading(false);
                    } else {
                      setModalVisible(false);
                      props.fetchBooks();
                    }
                })

              }}>

              <Form.Group id="formFile" className="mb-3">
                <Form.Label>upload any valid <code>epub</code> document</Form.Label>
                <Form.Control type="file" name="epubDocument" accept=".epub" required/>
              </Form.Group>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <button
              className="text-md py-2 w-1/3 bg-orange-300 rounded-full border-orange-300 border-2 md:w-1/4"
              href="#"
              onClick={() => {
                let submitEvent = new Event("submit", {bubbles: true, cancelable: true});
                submitEvent.simulated = true;
                formRef.current.dispatchEvent(submitEvent);
              }}
            >
          {!isLoading ? (
            "Yes"
          ) : (
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 mr-2 text-orange-200  animate-spin fill-orange-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
            </button>

            <button
              className="text-md py-2 w-1/3 text-orange-300 rounded-full border-orange-300 border-2 md:w-1/4"
              href="#"
              onClick={() => setModalVisible(false)}
            >
              No
            </button>

          </Modal.Footer>
        </Modal>
      )}

      <div className="flex flex-row gap-1 items-center w-full justify-center md:justify-end">
        {!currentUser ? (
          <Link
            className="text-black no-underline text-md py-2 w-1/2 bg-orange-300 rounded-full border-orange-300 border-2 flex items-center justify-center gap-2 md:w-1/4"
            to="/login"
          >
            Register
          </Link>
        ) : (
          <button
            className="text-md py-2 w-1/2 bg-orange-300 rounded-full border-orange-300 border-2 flex items-center justify-center gap-2 md:w-1/4"
            href="#"
            onClick={() => setModalVisible(true)}
          >
            <Book size={18} />
            Publish
          </button>
        )}
      </div>
    </nav>
  );
}

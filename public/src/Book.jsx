import "./Book.css";
import { useState, useContext } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import UserContext from "./UserContext.js";

export default function Book(props) {
  let [modalVisible, setModalVisible] = useState(false);
  let [currentUser, _] = useContext(UserContext);

  let toggleModal = () => setModalVisible(!modalVisible);

  return (
    <div className="flex gap-4 w-full">
      <div className="book-container">
        <div className="book">
          <img src={props.data.cover} />
        </div>
      </div>
      {!currentUser ? (
        <ToastContainer className="top-2 left-2">
          <Toast
            className="fixed"
            show={modalVisible}
            onClose={() => setModalVisible(false)}
            delay={2000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Login first</strong>
            </Toast.Header>
            <Toast.Body>you need to login to issue a book</Toast.Body>
          </Toast>
        </ToastContainer>
      ) : (
        <Modal
          show={modalVisible}
          onHide={toggleModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Issue "<span className="capitalize">{props.data.title}</span>"
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This book will be issued to {currentUser.data.email} are you sure?
          </Modal.Body>
          <Modal.Footer className="flex flex-row w-full">
            <button
              className="text-md py-2 w-1/3 bg-orange-300 rounded-full border-orange-300 border-2 flex items-center justify-center gap-2 md:w-1/4"
              href="#"
            >
              Yes
            </button>

            <button
              className="text-md py-2 w-1/3 rounded-full border-orange-300 border-2 flex items-center justify-center gap-2 md:w-1/4"
              href="#"
              onClick={toggleModal}
            >
              No
            </button>
          </Modal.Footer>
        </Modal>
      )}

      <div className="content flex flex-col w-1/2">
        <strong className="capitalize font-serif">{props.data.title}</strong>
        <small className="text-neutral-500">By {props.data.author}</small>
        <button
          className="text-md mt-auto py-1 w-full text-orange-300 border-[1px] border-orange-300 rounded-full"
          onClick={() => setModalVisible(true)}
          href="#"
        >
          Issue Book
        </button>
      </div>
    </div>
  );
}

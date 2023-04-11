import "./Book.css";
import { useState, useContext, useEffect } from "react";
import { Modal, Toast, ToastContainer } from "react-bootstrap";
import UserContext from "./UserContext.js";

export default function Book(props) {
  let [modalVisible, setModalVisible] = useState(false);
  let [currentUser, setCurrentUser] = useContext(UserContext);
  let [isIssued, setIssued] = useState(false);

  useEffect(() => {
    if (foundIssue) {
      setIssued(true);
    }
  }, [])

  return (
    <div className="flex gap-4 w-full">
      <div className="book-container">
        <div className="book">
          <img src={props.data.cover} />
        </div>
      </div>
      <div className="content flex flex-col w-1/2">
        <strong className="capitalize font-serif break-all">{props.data.title}</strong>
        <small className="text-neutral-500">By {props.data.author}</small>
        <button
          className="text-md mt-auto py-1 w-full text-orange-300 border-[1px] border-orange-300 rounded-full"
          onClick={() => {
          }}
          href="#"
        >
          {isIssued ? "Read" : "Issue"}
        </button>
      </div>
    </div>
  );
}

import { Book, Bookmark } from "react-bootstrap-icons";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useContext }  from "react";
import "./Login.css";
import UserContext from "./UserContext.js";

/*
 *
 *
    <ToastContainer className="top-4 left-4">
    <Toast className="fixed" show={modalVisible} onClose={toggleModal} delay={3000} autohide>
    <Toast.Header>
    <img
    src="holder.js/20x20?text=%20"
    className="rounded me-2"
    alt=""
    />
    <strong className="me-auto">Bootstrap</strong>
    <small>11 mins ago</small>
    </Toast.Header>
    <Toast.Body>
      Logged
    </Toast.Body>
    </Toast>

    </ToastContainer>

*/

export default function Login() {
  const [modalVisible, setModalVisible] = useState(true);
  const toggleModal = () => setModalVisible(!modalVisible);
  const [currentUser, setCurrentUserToValue ] = useContext(UserContext);

  let handleSubmit = (e) => {
    e.preventDefault();
    let formProps = Object.fromEntries(new FormData(e.target));

    fetch("http://localhost:4000/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: formProps.email,
        password: formProps.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        sessionStorage.setItem("TOKEN", data.token);
        setCurrentUserToValue(data);
        return;
      })
  }

  return (
    <>
      <Form className="bg-orange-100 px-2 py-2 rounded-sm"  onSubmit={handleSubmit}>
      <Form.Group className="mb-2" controlId="formBasicEmail">
        <Form.Label className="text-neutral-500">Email address</Form.Label>
        <Form.Control className="border-none" type="email" placeholder="eg foo@bar.com" name="email" required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className="text-neutral-500">Password</Form.Label>
        <Form.Control className="border-none" type="password" placeholder="eg 1234" name="password" required/>
      </Form.Group>

      <button className="text-md py-2 w-full bg-orange-300 border-none rounded-sm md:w-1/4" type="submit">
        Submit
      </button>
    </Form>
    </>
  )
}

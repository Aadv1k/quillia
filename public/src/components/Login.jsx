import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "wouter";
import { useState, useContext, useEffect } from "react";
import "./Login.css";
import UserContext from "../UserContext.js";
import { CustomToast } from "./Toast.jsx";


export default function Login(props) {
  const [_a, navigate] = useLocation();
  const [currentUser, setCurrentUserToValue] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [isToastShown, setShowToast] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("Token")) 
      navigate("/")
  }, [])

  let handleSubmit = async (e) => {
    e.preventDefault();
    let formProps = Object.fromEntries(new FormData(e.target));

    setIsLoading(true);

    const loginResponse = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email: formProps.email,
        password: formProps.password,
      }),
    })

    const loginData = await loginResponse.json();

    if (loginData.error !== "user-not-found" && loginData.error !== null) {
      setError(loginData);
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    if (loginData.error === null) {
      localStorage.setItem("Token", JSON.stringify({
        token: loginData.token,
        user: loginData.data
      }));

      setCurrentUserToValue({
        token: loginData.token,
        user: loginData.data
      });

      window.location.reload()
      setIsLoading(false);
      return;
    }

    const signupResponse = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        email: formProps.email,
        password: formProps.password,
      }),
    })

    const signupData = await signupResponse.json();

    if (signupData.error) {
      setError(signupData);
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    localStorage.setItem("Token", JSON.stringify({
      token: signupData.token,
      user:  signupData.data
    }));

    setCurrentUserToValue({
      token: signupData.token,
      user:  signupData.data
    });

    navigate("/", { replace: true });
    setIsLoading(false);
  };

  return (
    <>
      {Object.keys(error).length !== 0 &&
        <CustomToast 
          title={error.error}
          body={error.message}
          visible={isToastShown}
          setVisible={setShowToast}
        />
      }

      <Form
        className="bg-orange-100 px-2 py-2 rounded-sm"
        onSubmit={handleSubmit}
      >
        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label className="text-neutral-500">Email address</Form.Label>
          <Form.Control
            className="border-none"
            type="email"
            placeholder="eg foo@bar.com"
            name="email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="text-neutral-500">Password</Form.Label>
          <Form.Control
            className="border-none"
            type="password"
            placeholder="eg 1234"
            name="password"
            required
          />
        </Form.Group>

        <button
          className="btn--primary w-full rounded-sm md:w-1/4"
          type="submit"
        >
          {!isLoading ? (
            "Submit"
          ) : (
            <svg
              aria-hidden="true"
              className="inline w-6 h-6 mr-2 text-orange-200 animate-spin fill-orange-300"
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
      </Form>
    </>
  );
}

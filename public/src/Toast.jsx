import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export function CustomToast({title, sub, body, visible, setVisible}) {
  return (
    <ToastContainer  className="top-2 left-2">
    <Toast show={visible} onClose={() => setVisible(false)} autohide delay={3000}>
      <Toast.Header>
        <strong className="me-auto">{title}</strong>
        {sub && <small>{sub}</small>}
      </Toast.Header>
      <Toast.Body>{body}</Toast.Body>
    </Toast>
    </ToastContainer>
  )
}

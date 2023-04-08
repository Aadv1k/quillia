import { Book, Bookmark } from "react-bootstrap-icons";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState }  from "react";

export default function Navbar() {

  return (
    <nav className="flex justify-center flex-col items-center px-4 py-4 gap-3 max-w-5xl mx-auto md:flex-row">
      <a href="#" className="nav__title text-4xl font-serif text-black no-underline">Quillia</a>
      <div className="flex flex-row gap-1 items-center w-full justify-center md:justify-end">
        <button  className="text-md py-2 w-1/2 bg-orange-300 rounded-full border-orange-300 border-2 flex items-center justify-center gap-2 md:w-1/4" href="#">
          <Book size={18} />
          Publish
        </button>
      </div>
    </nav>
  )
}

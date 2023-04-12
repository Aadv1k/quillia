import { useState, useContext, useEffect } from "react";
import UserContext from "./UserContext.js";
import { ReactReader } from "react-reader";

export default function BookPage(props) {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [location, setLocation] = useState(null)
  const [epubDataURL, setEpubDataURL] = useState(null);
  const locationChanged = epubcifi => {
    setLocation(epubcifi)
  }

  useEffect(() => {
    fetch(`/api/issues/${props.bookid}/`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + JSON.parse(currentUser).token
      }
    }).then(e => e.blob())
      .then(blob => {
        setEpubDataURL(blob);
      })

  }, [])

  return (
    <div className="bg-orange-100 text-orange-900 font-medium text-md leading-6 h-full">
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url={epubDataURL}
      />
    </div>
  );
}

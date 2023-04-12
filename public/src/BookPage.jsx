import { useState, useContext, useEffect } from "react";
import UserContext from "./UserContext.js";

export default function BookPage(props) {
  const [pageContent, setPageContent] = useState("");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let token = JSON.parse(currentUser).token;
    fetch(`/api/issues/${props.bookid}/${props.pageNumber}`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
      }
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.error) {
          setError(data.error);
        } else {
          setPageContent(data.data.content);
        }
      })
  }, [props.pageNumber]);

  return (
    <div className="bg-orange-100 text-orange-900 font-medium text-md leading-6">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: pageContent }} />
      )}
    </div>
  );
}

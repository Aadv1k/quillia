import { useState, useContext, useEffect } from "react";
import UserContext from "./UserContext.js";
import { ReactReader } from "react-reader";

export default function BookPage(props) {
  const [location, setLocation] = useState(null)
  const locationChanged = epubcifi => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi)
  }

  return (
    <div className="bg-orange-100 text-orange-900 font-medium text-md leading-6 h-full">
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url="https://react-reader.metabits.no/files/alice.epub"
      />
    </div>
  );
}

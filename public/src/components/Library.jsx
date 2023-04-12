import Book from "./Book.jsx";

export default function Library({ bookData, issueData }) {
  return (
    <section className="library">
      <section className="max-w-5xl mx-auto px-4 my-6">
        <h2 className="font-serif mb-4">Latest</h2>
        <div className="grid gap-y-6 grid-cols-1 md:grid-cols-2">
          {bookData.slice(-2).reverse().map((e, i) => {
            return (
              <Book
                key={i}
                data={e}
                issueData={issueData}
              />
            );
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 my-4">
        <h2 className="font-serif mb-4">Library</h2>
        <div className="grid gap-y-6 grid-cols-1 md:grid-cols-2">
          {bookData.slice(0, -2).reverse().map((e, i) => {
            return (
              <Book
                key={i}
                data={e}
                issueData={issueData}
              />
            );
          })}
        </div>
      </section>
    </section>
  );
}

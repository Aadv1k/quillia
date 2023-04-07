export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-3 py-4">
      <a href="#" className="nav__title text-2xl font-serif">Quillia</a>

      <div className="flex flex-row gap-1 items-center">
        <button className="underline text-md" href="#">Publish</button>
        <button className="underline text-md" href="#">Issue</button>
        <button className="underline text-md" href="#">Login</button>
      </div>
    </nav>
  )
}

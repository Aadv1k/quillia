export default function(email: string): boolean {
  let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (!email.match(emailRegex)) {
    return false;
  }
  return true;
}

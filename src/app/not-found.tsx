import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <span>ERROR 404 · SAVE FILE MISSING</span>
      <h1>This room is not on the map.</h1>
      <p>The link may be old, or the project has not escaped the notes app yet.</p>
      <Link className="link-button link-button-primary" href="/">Return home</Link>
    </div>
  );
}

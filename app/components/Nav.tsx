import Link from "next/link";

export default function Nav() {
  return (
    <div className="nav">
      <div className="container flex h-16 items-center justify-between">
        <Link className="no-underline font-extrabold tracking-wide" href="/">Latimore Life & Legacy</Link>
        <div className="flex gap-6 text-sm">
          <Link className="no-underline hover:underline" href="/education">Education</Link>
          <Link className="no-underline hover:underline" href="/contact">Contact</Link>
        </div>
      </div>
    </div>
  );
}

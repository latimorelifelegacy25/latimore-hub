import Nav from "./components/Nav";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Nav />
      <main className="container py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Protecting Today. Securing Tomorrow.
        </h1>

        <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
          Education-first insurance protection, retirement strategies, and legacy planning for families and business owners.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link className="btn btn-primary" href="/contact">Book a Consultation</Link>
          <Link className="btn btn-ghost" href="/education">Explore Education</Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h3 className="text-xl font-bold">Living Benefits</h3>
            <p className="mt-2 text-white/75">Protection that can help during critical, chronic, or terminal illness.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-bold">Retirement Protection</h3>
            <p className="mt-2 text-white/75">Strategies focused on principal protection and predictable income.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-bold">Legacy Planning</h3>
            <p className="mt-2 text-white/75">Clear plans to protect what you built and pass it on smoothly.</p>
          </div>
        </div>
      </main>
    </>
  );
}

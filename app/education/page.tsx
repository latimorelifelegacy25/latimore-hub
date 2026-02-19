import Nav from "../components/Nav";
import Link from "next/link";

const posts = [
  {
    slug: "living-benefits-101",
    title: "Living Benefits 101",
    excerpt: "How living benefits can help during a health crisis—before a death benefit is ever paid.",
  },
  {
    slug: "mortgage-protection-basics",
    title: "Mortgage Protection Basics",
    excerpt: "What it is, who needs it, and how to choose the right term for your family.",
  },
  {
    slug: "rollovers-without-regret",
    title: "IRA & 401(k) Rollovers Without Regret",
    excerpt: "How to think about risk, timing, and guarantees when protecting retirement money.",
  },
];

export default function EducationPage() {
  return (
    <>
      <Nav />
      <main className="container py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Education</h1>
        <p className="mt-4 max-w-2xl text-white/80">
          Straightforward education to help you make confident decisions—without the jargon.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <div key={p.slug} className="card p-6">
              <h2 className="text-2xl font-bold">{p.title}</h2>
              <p className="mt-2 text-white/75">{p.excerpt}</p>
              <div className="mt-6">
                <Link className="btn btn-ghost" href="/contact">Talk to Me</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

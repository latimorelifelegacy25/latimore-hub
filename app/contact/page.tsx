import Nav from "../components/Nav";

const CAL_URL = "https://calendar.google.com/calendar/appointments/AcZssZ0pWKOYTgg4xc8vleuqTnfpTwqm8oYaG2B5TxA=?gv=true";
const FILL_URL = "https://latimorelifelegacy.fillout.com/latimorelifelegacy";

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="container py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Contact</h1>
        <p className="mt-4 max-w-2xl text-white/80">
          Book a time on my calendar, or fill out the form and I’ll reach out.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Book an Appointment</h2>
          <div className="mt-4 card overflow-hidden">
            <iframe
              src={CAL_URL}
              style={{ border: 0 }}
              width="100%"
              height="650"
              loading="lazy"
              title="Google Calendar Appointment Scheduling"
            />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Prefer a quick form instead?</h2>
          <div className="mt-4 card overflow-hidden">
            <iframe
              src={FILL_URL}
              width="100%"
              height="950"
              style={{ border: 0 }}
              loading="lazy"
              title="Latimore Life & Legacy Form"
              allow="clipboard-write; microphone; camera"
            />
          </div>
        </section>

        <section className="mt-12 card p-6">
          <h3 className="text-xl font-bold">Direct Contact</h3>
          <p className="mt-2 text-white/75">If you prefer, reply by phone or email.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a className="btn btn-ghost" href="tel:+1">Call</a>
            <a className="btn btn-ghost" href="mailto:">Email</a>
          </div>
        </section>
      </main>
    </>
  );
}

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Contact() {
  const [params] = useSearchParams();
  const isReport = params.get("subject") === "report-issue";
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: "Contact" }]} />
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        {isReport ? "Report an issue" : "Contact us"}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {isReport
          ? "Tell us what looks wrong — a metadata mistake, a broken file, or the wrong paper entirely."
          : "Questions, suggestions, or something that needs fixing — we read everything."}
      </p>

      {submitted ? (
        <div className="mt-6 rounded-card border border-pass/30 bg-pass-light p-5 text-pass">
          <p className="font-medium">Thanks — that's been sent.</p>
          <p className="mt-1 text-sm">We'll follow up by email if we need more detail.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-card border border-paper-line bg-white p-6">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Email</span>
            <input type="email" required className="w-full rounded-md border border-paper-line px-3 py-2 text-sm outline-none focus:border-stamp" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Message</span>
            <textarea required rows={5} className="w-full rounded-md border border-paper-line px-3 py-2 text-sm outline-none focus:border-stamp" />
          </label>
          <button type="submit" className="rounded-md bg-stamp px-5 py-2.5 text-sm font-medium text-white hover:bg-stamp-dark">
            Send
          </button>
        </form>
      )}
    </div>
  );
}

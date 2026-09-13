import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <EmptyState icon="🧭" title="This page doesn't exist" description="The link may be old or mistyped. Search for the paper you need instead." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search papers…"
          className="w-full rounded-full border border-paper-line bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp"
        />
        <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Search</button>
      </form>
    </div>
  );
}

import Breadcrumbs from "./Breadcrumbs";

export default function StaticPage({ title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ to: "/", label: "Home" }, { label: title }]} />
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
      <div className="prose prose-sm mt-6 max-w-none text-ink-soft [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mt-6 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto whitespace-nowrap text-sm text-ink-faint">
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to && i !== items.length - 1 ? (
              <Link to={item.to} className="hover:text-stamp">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink" aria-current={i === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

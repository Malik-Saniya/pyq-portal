import { Component } from "react";

// Catches render errors below it so one broken page shows a message instead of
// a blank screen. It does not fix errors — they are still logged to the
// console (and shown on screen in dev) so the real bug stays visible.
//
//  - resetKey : when it changes (e.g. the location), the boundary clears the
//               error and tries to render again, so navigating away or pressing
//               Back always recovers.
//  - variant  : "page" renders inside the layout; "app" is the last resort for
//               failures outside any page (header, footer, router).
export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  // Clears a stored error as soon as resetKey changes (navigation / Back).
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  componentDidCatch(error, info) {
    console.error("[PYQ] Render error:", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isApp = this.props.variant === "app";
    return (
      <div className={`mx-auto max-w-xl px-4 ${isApp ? "py-24" : "py-16"}`} role="alert">
        <div className="flex flex-col items-center rounded-card border border-dashed border-paper-line bg-white/50 px-6 py-14 text-center">
          <div className="mb-3 text-3xl" aria-hidden="true">
            ⚠️
          </div>
          <h1 className="font-display text-lg font-semibold text-ink">Something went wrong on this page</h1>
          <p className="mt-1.5 max-w-sm text-sm text-ink-soft">
            The page couldn't be displayed. Your bookmarks and history are safe. Try again, or head back to the home page.
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-4 max-w-full overflow-x-auto rounded-md bg-paper-dim p-3 text-left text-xs text-stamp-dark">
              {String(error?.message ?? error)}
            </pre>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
            >
              Try again
            </button>
            {/* Plain link on purpose: a full reload also clears any broken router state. */}
            <a
              href="/"
              className="rounded-md border border-paper-line bg-white px-4 py-2 text-sm font-medium text-ink-soft hover:border-stamp hover:text-stamp"
            >
              Go to home page
            </a>
          </div>
        </div>
      </div>
    );
  }
}
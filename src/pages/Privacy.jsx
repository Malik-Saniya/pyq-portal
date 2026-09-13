import StaticPage from "../components/StaticPage";

export default function Privacy() {
  return (
    <StaticPage title="Privacy Policy">
      <p>
        PYQ Portal is designed to work without an account. Bookmarks and recently-viewed papers
        are stored locally in your browser and are never sent to a server.
      </p>
      <h2>What we collect</h2>
      <p>
        Basic, aggregated usage signals (such as which searches return no results) to improve
        discovery — never tied to your identity for guests.
      </p>
      <h2>Contact forms</h2>
      <p>
        If you submit a contact or report form, we use your email only to reply about that
        submission.
      </p>
    </StaticPage>
  );
}

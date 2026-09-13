import StaticPage from "../components/StaticPage";

export default function About() {
  return (
    <StaticPage title="About PYQ Portal">
      <p>
        PYQ Portal exists to solve one problem: finding the right previous-year question paper
        should take seconds, not a scavenger hunt across scanned PDFs and broken links.
      </p>
      <h2>What we organize</h2>
      <p>
        Degree/UG papers by university, course, semester and academic year, and Junior
        College/HSC papers by board, stream and standard — with consistent metadata so you
        always know exactly what you're opening before you download it.
      </p>
      <h2>What we don't do</h2>
      <p>
        We don't require an account to search, preview or download. We don't guess at metadata —
        if something looks wrong on a paper, you can report it directly from that paper's page.
      </p>
    </StaticPage>
  );
}

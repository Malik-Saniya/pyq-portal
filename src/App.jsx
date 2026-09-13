import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import ExploreLevel from "./pages/ExploreLevel";
import Subject from "./pages/Subject";
import PaperDetail from "./pages/PaperDetail";
import Library from "./pages/Library";
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ContentPolicy from "./pages/ContentPolicy";
import NotFound from "./pages/NotFound";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="explore" element={<Navigate to="/explore/degree" replace />} />
          <Route path="explore/:level" element={<ExploreLevel />} />
          <Route path="subject/:subjectSlug" element={<Subject />} />
          <Route path="paper/:paperSlug" element={<PaperDetail />} />
          <Route path="library" element={<Library />} />
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="contact" element={<Contact />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="content-policy" element={<ContentPolicy />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

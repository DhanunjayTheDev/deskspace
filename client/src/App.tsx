import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BottomNav from "./components/BottomNav";
import FloatingActions from "./components/FloatingActions";

const Home = lazy(() => import("./pages/Home"));
const Workspaces = lazy(() => import("./pages/Workspaces"));
const WorkspaceDetails = lazy(() => import("./pages/WorkspaceDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

function PageLoader() {
  return (
    <div className="flex min-h-screen-d items-center justify-center">
      <div
        className="h-7 w-7 animate-spin rounded-full border-[3px] border-line-strong border-t-primary-600"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

function FloatingActionsWrapper() {
  const { pathname } = useLocation();
  if (pathname === "/contact") return null;

  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919666120770";
  const formattedPhone = phoneNumber.startsWith("91")
    ? `+${phoneNumber}`
    : `+91${phoneNumber}`;

  return <FloatingActions phoneNumber={phoneNumber} formattedPhone={formattedPhone} />;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      {/* `grain` lays a fixed, non-interactive noise film over the page so the
          flat surfaces read as printed stock rather than plastic. */}
      <div className="grain flex min-h-screen-d flex-col">
        <Navbar />
        {/* The tab bar is fixed, so content reserves room for it on phones. */}
        <main className="flex-1 pb-tabbar md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workspaces" element={<Workspaces />} />
              <Route path="/workspaces/:id" element={<WorkspaceDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
        <FloatingActionsWrapper />
        <div className="pb-tabbar md:pb-0">
          <Footer />
        </div>
        <BottomNav />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SSEProvider } from "./context/SSEContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workspaces from "./pages/Workspaces";
import WorkspaceForm from "./pages/WorkspaceForm";
import Leads from "./pages/Leads";
import SiteContent from "./pages/SiteContent";
import AboutContent from "./pages/AboutContent";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <SSEProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <AdminLayout><Workspaces /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces/new"
            element={
              <ProtectedRoute>
                <AdminLayout><WorkspaceForm /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout><WorkspaceForm /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <AdminLayout><Leads /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/site-content"
            element={
              <ProtectedRoute>
                <AdminLayout><SiteContent /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about-content"
            element={
              <ProtectedRoute>
                <AdminLayout><AboutContent /></AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </SSEProvider>
    </AuthProvider>
    </BrowserRouter>
  );
}

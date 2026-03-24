import { NavLink, useNavigate } from "react-router-dom";
import { Home, LayoutGrid, Search, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/workspaces", icon: LayoutGrid, label: "Browse" },
  { to: "/workspaces?focus=search", icon: Search, label: "Search", isSearch: true },
  { to: "/about", icon: User, label: "About" },
];

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          if (item.isSearch) {
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate("/workspaces");
                  // small delay so page loads, then scroll to search
                  setTimeout(() => {
                    const el = document.querySelector<HTMLInputElement>("input[type='text']");
                    if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
                  }, 300);
                }}
                className="flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 hover:text-primary-600 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                  isActive ? "text-primary-600" : "text-gray-400 hover:text-primary-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary-50" : ""}`}>
                    <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary-600" : ""}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

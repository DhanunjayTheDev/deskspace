import { NavLink, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Phone, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/workspaces", icon: LayoutGrid, label: "Browse" },
  { to: "/about", icon: User, label: "About" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                isActive ? "text-primary-600" : "text-gray-400 hover:text-primary-500"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-primary-50" : ""}`}>
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2]" : ""}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-primary-600" : ""}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
        <a
          href="tel:+919999999999"
          className="flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 hover:text-green-600 transition-colors"
        >
          <div className="p-1.5 rounded-xl bg-green-50">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium text-green-600">Call</span>
        </a>
      </div>
    </nav>
  );
}
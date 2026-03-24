import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building, Users, Globe, Info } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/workspaces", icon: Building, label: "Spaces" },
  { to: "/leads", icon: Users, label: "Leads" },
  { to: "/site-content", icon: Globe, label: "Site" },
  { to: "/about-content", icon: Info, label: "About" },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
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
        ))}
      </div>
    </nav>
  );
}

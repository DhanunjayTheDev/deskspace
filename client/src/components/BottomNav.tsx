import { useLocation, useNavigate } from "react-router-dom";
import { Home, Info, LayoutGrid, MessageSquare } from "lucide-react";
// @ts-ignore - JS component from React Bits
import Dock from "./Dock";

const tabs = [
  { to: "/", icon: Home, label: "Home", exact: true },
  { to: "/workspaces", icon: LayoutGrid, label: "Browse", exact: false },
  { to: "/about", icon: Info, label: "About", exact: false },
  { to: "/contact", icon: MessageSquare, label: "Contact", exact: false },
];

/**
 * Phone tab bar, built on the Dock component.
 *
 * Navigation itself is not animated — switching tabs happens dozens of times a
 * session and native tab bars are instant. The magnification is a pointer
 * affordance only; on touch the items stay at their base size (see Dock.css).
 */
export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = tabs.map((tab) => ({
    label: tab.label,
    icon: <tab.icon size={20} aria-hidden="true" />,
    active: tab.exact ? pathname === tab.to : pathname.startsWith(tab.to),
    onClick: () => navigate(tab.to),
  }));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-safe px-safe md:hidden">
      <Dock items={items} />
    </div>
  );
}

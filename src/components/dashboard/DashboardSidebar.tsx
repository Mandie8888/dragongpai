import { Link } from "react-router-dom";
import { LayoutDashboard, History, CreditCard, Settings } from "lucide-react";

interface Props {
  c: Record<string, string>;
  activeSection: string;
  setActiveSection: (s: string) => void;
}

const sidebarItems = (c: Record<string, string>) => [
  { label: c.overview, icon: LayoutDashboard, href: "#overview" },
  { label: c.history, icon: History, href: "#history" },
  { label: c.billing, icon: CreditCard, href: "/pricing" },
  { label: c.settings, icon: Settings, href: "/pricing" },
];

const DashboardSidebar = ({ c, activeSection, setActiveSection }: Props) => (
  <aside className="hidden md:flex flex-col w-56 border-r border-border bg-sidebar-background p-4 gap-1">
    {sidebarItems(c).map((item) => {
      const isHash = item.href.startsWith("#");
      const active = isHash && activeSection === item.href.slice(1);
      return isHash ? (
        <button
          key={item.label}
          onClick={() => setActiveSection(item.href.slice(1))}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`}
        >
          <item.icon size={16} />
          {item.label}
        </button>
      ) : (
        <Link
          key={item.label}
          to={item.href}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <item.icon size={16} />
          {item.label}
        </Link>
      );
    })}
  </aside>
);

export { sidebarItems };
export default DashboardSidebar;

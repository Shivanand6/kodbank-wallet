import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Bell,
  QrCode,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Tab = "overview" | "transactions" | "analytics" | "reminders" | "scan-pay" | "chatbot";

interface DashboardSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  username: string;
}

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "scan-pay", label: "Scan & Pay", icon: QrCode },
  { id: "chatbot", label: "KodBot AI", icon: MessageCircle },
];

const DashboardSidebar = ({
  activeTab,
  onTabChange,
  username,
}: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("kodbank_token");
    localStorage.removeItem("kodbank_username");
    document.cookie = "kodbank_token=; path=/; max-age=0";
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col border-r border-border/50 bg-sidebar-background transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border/50">
        <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-xl font-display font-bold gold-text">
            KodBank
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border/50 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            Logged in as{" "}
            <span className="text-foreground font-medium">{username}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </Button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

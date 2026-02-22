import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OverviewTab from "@/components/dashboard/OverviewTab";
import TransactionsTab from "@/components/dashboard/TransactionsTab";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import RemindersTab from "@/components/dashboard/RemindersTab";
import ScanPayTab from "@/components/dashboard/ScanPayTab";
import HuggingChatbot from "@/components/HuggingChatbot";

type Tab =
  | "overview"
  | "transactions"
  | "analytics"
  | "reminders"
  | "scan-pay"
  | "chatbot";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("kodbank_token");
    const user = localStorage.getItem("kodbank_username");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    setUsername(user);
  }, [navigate]);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "transactions":
        return <TransactionsTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "reminders":
        return <RemindersTab />;
      case "scan-pay":
        return <ScanPayTab />;
      case "chatbot":
        return <HuggingChatbot />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        username={username}
      />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
};

export default Dashboard;

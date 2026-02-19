import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ConfettiCelebration from "@/components/ConfettiCelebration";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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

  const checkBalance = useCallback(async () => {
    const token = localStorage.getItem("kodbank_token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setShowCelebration(false);

    try {
      const { data, error } = await supabase.functions.invoke("check-balance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setBalance(data.balance);
      setShowCelebration(true);
    } catch (err: any) {
      if (err.message?.includes("expired") || err.message?.includes("Invalid")) {
        localStorage.removeItem("kodbank_token");
        localStorage.removeItem("kodbank_username");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("kodbank_token");
    localStorage.removeItem("kodbank_username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {showCelebration && <ConfettiCelebration />}

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-primary/3 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-border/50">
        <h1 className="text-2xl font-display font-bold gold-text">KodBank</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            Welcome, <span className="text-foreground font-medium">{username}</span>
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-border/50 text-muted-foreground hover:text-foreground">
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg w-full glow-gold">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Account Dashboard</h2>
            <p className="text-muted-foreground">Check your current balance</p>
          </div>

          {balance !== null && showCelebration && (
            <div className="mb-8 animate-pop-in">
              <p className="text-muted-foreground text-sm mb-2">Your Balance</p>
              <p className="text-5xl font-display font-bold gold-text">
                ₹{balance.toLocaleString("en-IN")}
              </p>
            </div>
          )}

          <Button
            onClick={checkBalance}
            disabled={loading}
            className="gold-gradient text-primary-foreground font-display font-semibold h-14 px-10 text-lg hover:opacity-90 transition-opacity"
          >
            {loading ? "Checking..." : "Check Balance 💰"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

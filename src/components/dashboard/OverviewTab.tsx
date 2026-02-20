import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, CreditCard, Banknote, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ConfettiCelebration from "@/components/ConfettiCelebration";

const quickStats = [
  { label: "Last Credited", value: "₹12,500", icon: ArrowDownLeft, color: "text-emerald-400" },
  { label: "Last Debited", value: "₹3,200", icon: ArrowUpRight, color: "text-red-400" },
  { label: "Savings Goal", value: "72%", icon: TrendingUp, color: "text-primary" },
  { label: "Active Cards", value: "2", icon: CreditCard, color: "text-blue-400" },
];

const OverviewTab = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate();

  const checkBalance = useCallback(async () => {
    const token = localStorage.getItem("kodbank_token");
    if (!token) { navigate("/login"); return; }
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

  return (
    <div className="space-y-8">
      {showCelebration && <ConfettiCelebration />}

      {/* Balance Card */}
      <div className="glass-card rounded-2xl p-8 glow-gold">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Total Balance</p>
            {balance !== null ? (
              <p className="text-4xl font-display font-bold gold-text animate-pop-in">
                ₹{balance.toLocaleString("en-IN")}
              </p>
            ) : (
              <p className="text-2xl font-display text-muted-foreground">Click to reveal</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center">
              <Banknote className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
        </div>
        <Button
          onClick={checkBalance}
          disabled={loading}
          className="mt-6 gold-gradient text-primary-foreground font-display font-semibold h-12 px-8 text-base hover:opacity-90 transition-opacity"
        >
          {loading ? "Checking..." : "Check Balance 💰"}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <Shield className="w-4 h-4 text-muted-foreground/30" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { name: "Netflix Subscription", amount: -649, date: "Today", type: "debit" },
            { name: "Salary Credit", amount: 45000, date: "Yesterday", type: "credit" },
            { name: "Electricity Bill", amount: -2340, date: "Feb 18", type: "debit" },
            { name: "UPI - Rahul K.", amount: -1500, date: "Feb 17", type: "debit" },
            { name: "Cashback Reward", amount: 200, date: "Feb 16", type: "credit" },
          ].map((txn, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${txn.type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                  {txn.type === "credit" ? (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{txn.name}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${txn.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                {txn.type === "credit" ? "+" : ""}₹{Math.abs(txn.amount).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

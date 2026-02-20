import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const allTransactions = [
  { id: 1, name: "Netflix Subscription", amount: -649, date: "2026-02-20", category: "Entertainment", type: "debit" },
  { id: 2, name: "Salary Credit - TechCorp", amount: 45000, date: "2026-02-19", category: "Income", type: "credit" },
  { id: 3, name: "Electricity Bill - BESCOM", amount: -2340, date: "2026-02-18", category: "Bills", type: "debit" },
  { id: 4, name: "UPI - Rahul Kumar", amount: -1500, date: "2026-02-17", category: "Transfer", type: "debit" },
  { id: 5, name: "Cashback Reward", amount: 200, date: "2026-02-16", category: "Rewards", type: "credit" },
  { id: 6, name: "Amazon Shopping", amount: -3499, date: "2026-02-15", category: "Shopping", type: "debit" },
  { id: 7, name: "Freelance Payment", amount: 12500, date: "2026-02-14", category: "Income", type: "credit" },
  { id: 8, name: "Swiggy Order", amount: -450, date: "2026-02-13", category: "Food", type: "debit" },
  { id: 9, name: "Mobile Recharge", amount: -599, date: "2026-02-12", category: "Bills", type: "debit" },
  { id: 10, name: "Interest Credit", amount: 850, date: "2026-02-11", category: "Income", type: "credit" },
  { id: 11, name: "Uber Ride", amount: -280, date: "2026-02-10", category: "Transport", type: "debit" },
  { id: 12, name: "Gym Membership", amount: -2000, date: "2026-02-09", category: "Health", type: "debit" },
];

const categories = ["All", "Income", "Bills", "Shopping", "Food", "Entertainment", "Transfer", "Transport", "Health", "Rewards"];

const TransactionsTab = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = allTransactions.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-foreground">Transaction History</h2>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 5).map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "gold-gradient text-primary-foreground" : "border-border/50 text-muted-foreground"}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass-card rounded-xl overflow-hidden">
        {filtered.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between px-5 py-4 border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === "credit" ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                {txn.type === "credit" ? (
                  <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{txn.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0">{txn.category}</Badge>
                </div>
              </div>
            </div>
            <p className={`text-sm font-bold ${txn.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
              {txn.type === "credit" ? "+" : "-"}₹{Math.abs(txn.amount).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No transactions found</div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTab;

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

const monthlyData = [
  { month: "Sep", income: 42000, expense: 18500 },
  { month: "Oct", income: 45000, expense: 22000 },
  { month: "Nov", income: 47000, expense: 19800 },
  { month: "Dec", income: 52000, expense: 31000 },
  { month: "Jan", income: 45000, expense: 24500 },
  { month: "Feb", income: 58000, expense: 15300 },
];

const categorySpending = [
  { name: "Bills", value: 5280, color: "#f97316" },
  { name: "Shopping", value: 3499, color: "#8b5cf6" },
  { name: "Food", value: 2800, color: "#ef4444" },
  { name: "Entertainment", value: 1649, color: "#3b82f6" },
  { name: "Transport", value: 1200, color: "#22c55e" },
  { name: "Health", value: 2000, color: "#ec4899" },
];

const balanceTrend = [
  { day: "Feb 1", balance: 85000 },
  { day: "Feb 5", balance: 82500 },
  { day: "Feb 10", balance: 94000 },
  { day: "Feb 14", balance: 91200 },
  { day: "Feb 17", balance: 88700 },
  { day: "Feb 20", balance: 100000 },
];

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Spending Analytics</h2>

      {/* Income vs Expense Bar Chart */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-base font-display font-semibold text-foreground mb-4">Income vs Expenses (6 months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
            <XAxis dataKey="month" stroke="hsl(215 20% 55%)" fontSize={12} />
            <YAxis stroke="hsl(215 20% 55%)" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(222 30% 20%)", borderRadius: "8px", color: "#fff" }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
            />
            <Bar dataKey="income" fill="hsl(45 93% 58%)" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {categorySpending.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(222 30% 20%)", borderRadius: "8px", color: "#fff" }}
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {categorySpending.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>

        {/* Balance Trend */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-base font-display font-semibold text-foreground mb-4">Balance Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45 93% 58%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(45 93% 58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="day" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(222 30% 20%)", borderRadius: "8px", color: "#fff" }}
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Balance"]}
              />
              <Area type="monotone" dataKey="balance" stroke="hsl(45 93% 58%)" fill="url(#balanceGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

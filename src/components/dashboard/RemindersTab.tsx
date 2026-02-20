import { useState } from "react";
import { Bell, Plus, Check, Clock, Trash2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Reminder {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid";
}

const initialReminders: Reminder[] = [
  { id: 1, title: "Electricity Bill - BESCOM", amount: 2500, dueDate: "2026-02-25", status: "pending" },
  { id: 2, title: "Broadband - ACT Fibernet", amount: 1199, dueDate: "2026-02-28", status: "pending" },
  { id: 3, title: "Credit Card EMI", amount: 5000, dueDate: "2026-03-05", status: "pending" },
  { id: 4, title: "Rent Payment", amount: 15000, dueDate: "2026-03-01", status: "pending" },
  { id: 5, title: "Mobile Recharge", amount: 599, dueDate: "2026-02-22", status: "paid" },
];

const RemindersTab = () => {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");

  const markPaid = (id: number) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
  };

  const deleteReminder = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addReminder = () => {
    if (!newTitle || !newAmount || !newDate) return;
    setReminders((prev) => [
      ...prev,
      { id: Date.now(), title: newTitle, amount: parseFloat(newAmount), dueDate: newDate, status: "pending" },
    ]);
    setNewTitle("");
    setNewAmount("");
    setNewDate("");
  };

  const pending = reminders.filter((r) => r.status === "pending");
  const paid = reminders.filter((r) => r.status === "paid");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Payment Reminders</h2>

      {/* Add Reminder */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Reminder
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="Bill name" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="bg-secondary/50 border-border/50" />
          <Input placeholder="Amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="bg-secondary/50 border-border/50 sm:w-32" />
          <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="bg-secondary/50 border-border/50 sm:w-44" />
          <Button onClick={addReminder} className="gold-gradient text-primary-foreground font-semibold shrink-0">Add</Button>
        </div>
      </div>

      {/* Pending */}
      <div>
        <h3 className="text-base font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Upcoming ({pending.length})
        </h3>
        <div className="space-y-2">
          {pending.map((r) => (
            <div key={r.id} className="glass-card rounded-lg px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarDays className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Due: {r.dueDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-foreground">₹{r.amount.toLocaleString("en-IN")}</p>
                <Button size="sm" variant="outline" onClick={() => markPaid(r.id)} className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Check className="w-3 h-3 mr-1" /> Paid
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteReminder(r.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paid */}
      {paid.length > 0 && (
        <div>
          <h3 className="text-base font-display font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" /> Completed ({paid.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {paid.map((r) => (
              <div key={r.id} className="glass-card rounded-lg px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground line-through">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.dueDate}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-muted-foreground">₹{r.amount.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersTab;

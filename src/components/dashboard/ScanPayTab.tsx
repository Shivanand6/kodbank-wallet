import { useState } from "react";
import { QrCode, Camera, Send, User, Phone, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const quickPay = [
  { name: "Rahul K.", phone: "9876XXXX10", avatar: "RK" },
  { name: "Priya S.", phone: "9123XXXX45", avatar: "PS" },
  { name: "Amit J.", phone: "9567XXXX89", avatar: "AJ" },
  { name: "Sneha M.", phone: "9012XXXX67", avatar: "SM" },
];

const ScanPayTab = () => {
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handlePay = () => {
    if (!upiId || !amount) {
      toast({ title: "Missing fields", description: "Please enter UPI ID and amount", variant: "destructive" });
      return;
    }
    toast({ title: "Payment Initiated! 🎉", description: `₹${parseFloat(amount).toLocaleString("en-IN")} sent to ${upiId}` });
    setUpiId("");
    setAmount("");
    setNote("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-foreground">Scan & Pay</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner Placeholder */}
        <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-48 h-48 border-2 border-dashed border-primary/40 rounded-2xl flex flex-col items-center justify-center mb-6">
            <QrCode className="w-16 h-16 text-primary/40 mb-3" />
            <p className="text-xs text-muted-foreground text-center">QR Scanner</p>
          </div>
          <Button variant="outline" className="border-primary/30 text-primary gap-2">
            <Camera className="w-4 h-4" /> Open Camera
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">Point camera at any QR code to pay instantly</p>
        </div>

        {/* Manual Pay */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-base font-display font-semibold text-foreground mb-5 flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" /> Send Money
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm">UPI ID / Phone Number</Label>
              <Input placeholder="user@upi or 9876543210" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm">Amount (₹)</Label>
              <Input placeholder="0.00" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80 text-sm">Note (optional)</Label>
              <Input placeholder="What's this for?" value={note} onChange={(e) => setNote(e.target.value)} className="bg-secondary/50 border-border/50" />
            </div>
            <Button onClick={handlePay} className="w-full gold-gradient text-primary-foreground font-display font-semibold h-12 text-base hover:opacity-90">
              Pay Now
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Pay Contacts */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-base font-display font-semibold text-foreground mb-4">Quick Pay</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickPay.map((contact) => (
            <button
              key={contact.name}
              onClick={() => setUpiId(contact.phone)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                {contact.avatar}
              </div>
              <p className="text-sm font-medium text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.phone}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanPayTab;

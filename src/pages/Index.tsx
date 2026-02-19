import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-display font-bold gold-text mb-6">
          KodBank
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Your trusted digital banking partner
        </p>
        <p className="text-muted-foreground/70 mb-10 max-w-md mx-auto">
          Secure, fast, and reliable. Start with ₹1,00,000 and manage your finances with confidence.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/register")}
            className="gold-gradient text-primary-foreground font-display font-semibold h-12 px-8 text-base hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="border-primary/30 text-primary font-display font-semibold h-12 px-8 text-base hover:bg-primary/10"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

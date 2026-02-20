import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("login", {
        body: { username, password },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Store token in localStorage and cookie
      localStorage.setItem("kodbank_token", data.token);
      localStorage.setItem("kodbank_username", data.username);
      document.cookie = `kodbank_token=${data.token}; path=/; max-age=3600; SameSite=Lax`;

      toast({ title: "Login successful!", description: `Welcome back, ${data.username}` });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold gold-text mb-2">KodBank</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="glass-card rounded-xl p-8 glow-gold">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground/80">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full gold-gradient text-primary-foreground font-display font-semibold h-12 text-base hover:opacity-90 transition-opacity">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

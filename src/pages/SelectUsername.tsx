import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const SelectUsername = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user already has a profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profile?.username) {
      navigate("/dashboard");
    }
  };

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
      setAvailable(null);
      return;
    }

    setChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", value.toLowerCase())
        .single();

      setAvailable(!data);
    } catch (error) {
      setAvailable(true);
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    // Only allow English letters, numbers, max 12 chars, min 3 chars
    const filtered = value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 12);

    setUsername(filtered);
    
    if (filtered.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(filtered);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3 || username.length > 12) {
      toast.error("اسم مستخدم غير صالح", {
        description: "يجب أن يكون اسم المستخدم بين 3 و 12 حرف",
      });
      return;
    }

    if (!available) {
      toast.error("اسم المستخدم غير متاح", {
        description: "اختر اسم مستخدم آخر",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("المستخدم غير مسجل");

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        username: username.toLowerCase(),
        discord_id: user.id.substring(0, 20),
      });

      if (error) throw error;

      // Create initial subscription record
      await supabase.from("user_subscriptions").insert({
        user_id: user.id,
        plan_type: "free",
        status: "active",
      });

      // Create initial stats
      await supabase.from("user_stats").insert({
        user_id: user.id,
      });

      toast.success("تم إنشاء حسابك بنجاح!", {
        description: `مرحباً @${username}`,
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Username creation error:", error);
      toast.error("حدث خطأ", {
        description: error.message || "تعذر حفظ اسم المستخدم",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-tertiary p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">اختر اسم المستخدم</h2>
            <p className="text-text-muted mt-2">
              اختر اسماً فريداً لحسابك (3-12 حرف إنجليزي)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-text-muted">
                اسم المستخدم
              </Label>
              <div className="relative mt-1">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="username"
                  className="discord-input"
                  required
                />
                {checking && (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted animate-spin" />
                )}
                {!checking && username.length >= 3 && available !== null && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {available ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {username.length > 0 && username.length < 3 && (
                <p className="text-warning text-sm mt-1">3 أحرف على الأقل</p>
              )}
              {username.length >= 3 && available === false && (
                <p className="text-destructive text-sm mt-1">اسم المستخدم مستخدم</p>
              )}
              {username.length >= 3 && available === true && (
                <p className="text-success text-sm mt-1">اسم المستخدم متاح!</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full discord-button bg-primary hover:bg-primary/90"
              disabled={loading || !available || username.length < 3}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  تأكيد
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectUsername;

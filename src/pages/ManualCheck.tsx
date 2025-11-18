import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

const ManualCheck = () => {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [canCheck, setCanCheck] = useState(true);
  const [nextCheckTime, setNextCheckTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    // Restore cooldown from localStorage on mount
    const restoreCooldown = () => {
      try {
        const savedCooldown = localStorage.getItem('manual_check_cooldown');
        if (savedCooldown) {
          const cooldownData = JSON.parse(savedCooldown);
          const cooldownTime = new Date(cooldownData.nextCheckTime);
          
          if (cooldownTime.getTime() > Date.now()) {
            setNextCheckTime(cooldownTime);
            setCanCheck(false);
          } else {
            localStorage.removeItem('manual_check_cooldown');
          }
        }
      } catch (error) {
        console.error("Error restoring cooldown:", error);
        localStorage.removeItem('manual_check_cooldown');
      }
    };
    
    restoreCooldown();
  }, []);

  useEffect(() => {
    if (nextCheckTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = nextCheckTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCanCheck(true);
          setNextCheckTime(null);
          setTimeRemaining("");
          localStorage.removeItem('manual_check_cooldown');
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextCheckTime]);

  const handleCheck = async () => {
    if (!username.trim()) {
      toast.error("يرجى إدخال اسم المستخدم");
      return;
    }

    if (!canCheck) {
      toast.error("يجب الانتظار قبل الفحص التالي");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول");
        return;
      }

      // Check if user has active tokens
      const { data: tokens } = await supabase
        .from("user_tokens")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (!tokens || tokens.length === 0) {
        toast.error("يجب إضافة توكن واحد على الأقل في صفحة التوكنات");
        return;
      }

      setChecking(true);
      setResult(null);

      const { data, error } = await supabase.functions.invoke("check-discord-username", {
        body: {
          usernames: [username.trim()],
          userId: user.id,
          tokenName: null, // Will use user's own tokens
        },
      });

      if (error) throw error;

      if (!data.success) {
        toast.error(data.error || "حدث خطأ أثناء الفحص");
        setChecking(false);
        return;
      }

      // Get result for the single username
      const usernameResult = data.results[username.trim()];
      
      if (usernameResult === "rate_limited") {
        const cooldownTime = new Date(Date.now() + 600000); // 10 minutes
        setNextCheckTime(cooldownTime);
        setCanCheck(false);
        
        localStorage.setItem('manual_check_cooldown', JSON.stringify({
          nextCheckTime: cooldownTime.toISOString()
        }));
        
        toast.error("تم تجاوز حد الطلبات. يجب الانتظار 10 دقائق");
        setChecking(false);
        return;
      }

      if (usernameResult === "token_invalid") {
        toast.error("التوكن غير صالح. يرجى تحديث التوكنات");
        setChecking(false);
        return;
      }

      // Set result based on availability
      const isAvailable = usernameResult === "available";
      setResult(isAvailable);
      
      if (data.success) {
        if (data.available) {
          toast.success(`${username} متاح! ✓`);
        } else {
          toast.error(`${username} غير متاح`);
        }
      }

      // Set 120 second cooldown
      const cooldownTime = new Date(Date.now() + 120000);
      setNextCheckTime(cooldownTime);
      setCanCheck(false);
      
      // Save to localStorage
      localStorage.setItem('manual_check_cooldown', JSON.stringify({
        nextCheckTime: cooldownTime.toISOString()
      }));

    } catch (error: any) {
      console.error("Error checking username:", error);
      toast.error("حدث خطأ أثناء الفحص");
    } finally {
      setChecking(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            الفحص اليدوي
          </h1>
          <p className="text-text-muted mt-1">
            افحص توفر أي يوزر Discord يدوياً
          </p>
        </div>

        {!canCheck && (
          <Card className="bg-warning/10 border-warning">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-warning flex-shrink-0" />
                <div>
                  <p className="font-semibold text-warning">
                    يجب الانتظار قبل الفحص التالي
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    الوقت المتبقي: {timeRemaining}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              فحص اليوزر
            </CardTitle>
            <CardDescription>
              أدخل اسم المستخدم الذي تريد فحص توفره (كول داون 120 ثانية بين كل فحص)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={checking}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              />
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={checking || !canCheck}
              className="w-full"
            >
              {checking ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الفحص...
                </>
              ) : (
                <>
                  <Search className="ml-2 h-4 w-4" />
                  فحص التوفر
                </>
              )}
            </Button>

            {result !== null && (
              <Card className={result ? "bg-success/10 border-success" : "bg-destructive/10 border-destructive"}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {result ? (
                      <>
                        <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-success">
                            اليوزر متاح! ✓
                          </p>
                          <p className="text-sm text-text-muted mt-1">
                            يمكنك استخدام هذا الاسم
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-destructive">
                            اليوزر غير متاح
                          </p>
                          <p className="text-sm text-text-muted mt-1">
                            هذا الاسم محجوز بالفعل
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManualCheck;

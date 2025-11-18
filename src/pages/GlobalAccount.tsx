import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Globe, CheckCircle2, XCircle, Loader2, AlertCircle, Clock, Sparkles } from "lucide-react";

interface GeneratedUsername {
  username: string;
  checking: boolean;
  available: boolean | null;
}

const GlobalAccount = () => {
  const [loading, setLoading] = useState(false);
  const [canCheck, setCanCheck] = useState(true);
  const [nextCheckTime, setNextCheckTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [rateLimitMessage, setRateLimitMessage] = useState<string>("");
  
  // Generation settings
  const [count, setCount] = useState([10]);
  const [minLength, setMinLength] = useState([4]);
  const [maxLength, setMaxLength] = useState([12]);
  const MAX_USERNAMES = 10;
  const [prefix, setPrefix] = useState("");
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeDots, setIncludeDots] = useState(false);
  const [includeUnderscores, setIncludeUnderscores] = useState(false);

  const [generatedUsernames, setGeneratedUsernames] = useState<GeneratedUsername[]>([]);
  const [isCheckingAll, setIsCheckingAll] = useState(false);

  useEffect(() => {
    restoreGlobalCooldown();
  }, []);

  const restoreGlobalCooldown = () => {
    try {
      const savedCooldown = localStorage.getItem('global_account_cooldown');
      if (savedCooldown) {
        const cooldownData = JSON.parse(savedCooldown);
        const cooldownTime = new Date(cooldownData.nextCheckTime);
        
        if (cooldownTime.getTime() > Date.now()) {
          setNextCheckTime(cooldownTime);
          setCanCheck(false);
          setRateLimitMessage(cooldownData.rateLimitMessage || "");
        } else {
          localStorage.removeItem('global_account_cooldown');
        }
      }
    } catch (error) {
      console.error("Error restoring cooldown:", error);
      localStorage.removeItem('global_account_cooldown');
    }
  };

  useEffect(() => {
    if (nextCheckTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = nextCheckTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCanCheck(true);
          setNextCheckTime(null);
          setTimeRemaining("");
          setRateLimitMessage("");
          localStorage.removeItem('global_account_cooldown');
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextCheckTime]);

  const generateUsername = () => {
    let charset = "";
    if (includeLetters) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeDots) charset += ".";
    if (includeUnderscores) charset += "_";

    if (charset === "") {
      toast.error("اختر على الأقل نوع واحد من الأحرف");
      return null;
    }

    const length = Math.floor(Math.random() * (maxLength[0] - minLength[0] + 1)) + minLength[0];
    let username = prefix;
    
    for (let i = username.length; i < length; i++) {
      username += charset[Math.floor(Math.random() * charset.length)];
    }

    if (username.startsWith('.') || username.endsWith('.')) {
      username = username.replace(/^\.|\.$/g, 'a');
    }

    return username;
  };

  const handleGenerate = () => {
    const usernames: GeneratedUsername[] = [];
    const usedUsernames = new Set<string>();

    while (usernames.length < Math.min(count[0], MAX_USERNAMES)) {
      const username = generateUsername();
      if (username && !usedUsernames.has(username)) {
        usedUsernames.add(username);
        usernames.push({
          username,
          checking: false,
          available: null
        });
      }
    }

    setGeneratedUsernames(usernames);
    toast.success(`تم توليد ${usernames.length} يوزر`);
  };

  const handleCheckAll = async () => {
    if (!canCheck) {
      toast.error("يرجى الانتظار حتى ينتهي وقت الانتظار");
      return;
    }

    if (generatedUsernames.length === 0) {
      toast.error("قم بتوليد يوزرات أولاً");
      return;
    }

    setIsCheckingAll(true);
    setGeneratedUsernames(prev => prev.map(u => ({ ...u, checking: true })));

    try {
      const { data, error } = await supabase.functions.invoke("check-discord-username", {
        body: { 
          usernames: generatedUsernames.map(u => u.username),
          tokenName: "Global"
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("rate limit")) {
          const retryAfter = data.retryAfter || 120;
          const cooldownEnd = new Date(Date.now() + retryAfter * 1000);
          setNextCheckTime(cooldownEnd);
          setCanCheck(false);
          setRateLimitMessage(data.error);
          
          localStorage.setItem('global_account_cooldown', JSON.stringify({
            nextCheckTime: cooldownEnd.toISOString(),
            rateLimitMessage: data.error
          }));
          
          toast.error(`تم تفعيل وقت الانتظار: ${retryAfter} ثانية`);
        } else {
          toast.error(data.error);
        }
        
        setGeneratedUsernames(prev => prev.map(u => ({ ...u, checking: false })));
        setIsCheckingAll(false);
        return;
      }

      const results = data.results || {};
      setGeneratedUsernames(prev => prev.map(u => ({
        ...u,
        checking: false,
        available: results[u.username] === "available"
      })));

      const availableCount = Object.values(results).filter(r => r === "available").length;
      toast.success(`اكتمل الفحص: ${availableCount} يوزر متاح من ${generatedUsernames.length}`);

    } catch (error: any) {
      console.error("Error checking usernames:", error);
      toast.error("حدث خطأ أثناء فحص اليوزرات");
      setGeneratedUsernames(prev => prev.map(u => ({ ...u, checking: false })));
    } finally {
      setIsCheckingAll(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-primary/20 glow-effect">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">الحساب العام</h1>
              <p className="text-muted-foreground mt-1">فحص مشترك للجميع - لا يتطلب توكن خاص</p>
            </div>
          </div>
        </div>

        {/* Rate Limit Warning */}
        {!canCheck && (
          <Card className="border-warning/50 bg-warning/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div className="flex-1">
                  <p className="font-medium text-warning">وقت انتظار نشط</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rateLimitMessage || "يرجى الانتظار قبل الفحص مرة أخرى"}
                  </p>
                </div>
                <div className="text-2xl font-bold text-warning">{timeRemaining}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generator Settings */}
        <Card className="card-gradient border-border/50 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              إعدادات التوليد
            </CardTitle>
            <CardDescription>خصص إعدادات توليد اليوزرات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>عدد اليوزرات ({count[0]})</Label>
              <Slider value={count} onValueChange={setCount} min={1} max={MAX_USERNAMES} step={1} />
              <p className="text-xs text-muted-foreground">الحد الأقصى: {MAX_USERNAMES}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الحد الأدنى للطول ({minLength[0]})</Label>
                <Slider value={minLength} onValueChange={setMinLength} min={3} max={12} step={1} />
              </div>
              <div className="space-y-2">
                <Label>الحد الأقصى للطول ({maxLength[0]})</Label>
                <Slider value={maxLength} onValueChange={setMaxLength} min={3} max={12} step={1} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>بادئة (اختياري)</Label>
              <Input 
                value={prefix} 
                onChange={(e) => setPrefix(e.target.value.toLowerCase())} 
                placeholder="مثال: pro_"
                className="bg-background-accent border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>أحرف</Label>
                <Switch checked={includeLetters} onCheckedChange={setIncludeLetters} />
              </div>
              <div className="flex items-center justify-between">
                <Label>أرقام</Label>
                <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              </div>
              <div className="flex items-center justify-between">
                <Label>نقاط (.)</Label>
                <Switch checked={includeDots} onCheckedChange={setIncludeDots} />
              </div>
              <div className="flex items-center justify-between">
                <Label>شرطة سفلية (_)</Label>
                <Switch checked={includeUnderscores} onCheckedChange={setIncludeUnderscores} />
              </div>
            </div>

            <Button onClick={handleGenerate} className="w-full glow-effect" size="lg">
              <Sparkles className="h-5 w-5 mr-2" />
              توليد يوزرات
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {generatedUsernames.length > 0 && (
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>اليوزرات المولدة</CardTitle>
                  <CardDescription>{generatedUsernames.length} يوزر</CardDescription>
                </div>
                <Button 
                  onClick={handleCheckAll} 
                  disabled={!canCheck || isCheckingAll}
                  className="glow-effect"
                >
                  {isCheckingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري الفحص...
                    </>
                  ) : (
                    "فحص الكل"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {generatedUsernames.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg bg-background-accent/50 border border-border/50 transition-all hover:bg-background-accent"
                  >
                    <span className="font-mono">{item.username}</span>
                    {item.checking ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : item.available === true ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : item.available === false ? (
                      <XCircle className="h-5 w-5 text-destructive" />
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GlobalAccount;

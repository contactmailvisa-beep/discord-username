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
import { Wand2, CheckCircle2, XCircle, Loader2, AlertCircle, Download, Save, Clock } from "lucide-react";

interface GeneratedUsername {
  username: string;
  checking: boolean;
  available: boolean | null;
}

const Generator = () => {
  const [loading, setLoading] = useState(false);
  const [canCheck, setCanCheck] = useState(true);
  const [nextCheckTime, setNextCheckTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  
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
  const [startWithLetter, setStartWithLetter] = useState(true);
  const [endWithLetter, setEndWithLetter] = useState(false);

  const [generatedUsernames, setGeneratedUsernames] = useState<GeneratedUsername[]>([]);

  useEffect(() => {
    checkCooldown();
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
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextCheckTime]);

  const checkCooldown = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc("can_user_check", { p_user_id: user.id });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        setCanCheck(result.can_check);
        if (!result.can_check) {
          setNextCheckTime(new Date(result.next_check_at));
        }
      }
    } catch (error: any) {
      console.error("Error checking cooldown:", error);
    }
  };

  const generateUsername = (): string => {
    const length = Math.floor(Math.random() * (maxLength[0] - minLength[0] + 1)) + minLength[0];
    const remainingLength = length - prefix.length;
    
    if (remainingLength < 1) return "";

    let chars = "";
    if (includeNumbers) chars += "0123456789";
    if (includeLetters) chars += "abcdefghijklmnopqrstuvwxyz";
    
    let username = prefix;
    
    // Start with letter if required
    if (startWithLetter && includeLetters) {
      username += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    }
    
    // Generate middle part
    const middleLength = remainingLength - (startWithLetter ? 1 : 0) - (endWithLetter ? 1 : 0);
    for (let i = 0; i < middleLength; i++) {
      let charSet = chars;
      
      // Add special chars at random positions (not first or last)
      if (i > 0 && i < middleLength - 1) {
        if (includeDots) charSet += ".";
        if (includeUnderscores) charSet += "_";
      }
      
      username += charSet[Math.floor(Math.random() * charSet.length)];
    }
    
    // End with letter if required
    if (endWithLetter && includeLetters) {
      username += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    }
    
    // Ensure no dots at start or end
    username = username.replace(/^\.+|\.+$/g, "");
    
    return username;
  };

  const handleGenerate = async () => {
    const targetCount = Math.min(count[0], MAX_USERNAMES);
    const usernames: GeneratedUsername[] = [];
    const generated = new Set<string>();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول");
        return;
      }

      // Get all previously checked usernames from database
      const { data: checkedUsernames } = await supabase
        .from("check_history")
        .select("username_checked");

      const checkedSet = new Set(checkedUsernames?.map(u => u.username_checked.toLowerCase()) || []);

      // Generate usernames and ensure they haven't been checked before
      let attempts = 0;
      const maxAttempts = targetCount * 100; // Prevent infinite loop

      while (usernames.length < targetCount && attempts < maxAttempts) {
        const username = generateUsername();
        const lowerUsername = username?.toLowerCase();
        
        if (
          username && 
          username.length >= 3 && 
          username.length <= 12 && 
          !generated.has(lowerUsername) &&
          !checkedSet.has(lowerUsername)
        ) {
          generated.add(lowerUsername);
          usernames.push({
            username,
            checking: false,
            available: null,
          });
        }
        attempts++;
      }

      if (usernames.length < targetCount) {
        toast.warning(`تم توليد ${usernames.length} يوزر فقط`, {
          description: "معظم الخيارات تم فحصها مسبقاً"
        });
      } else {
        toast.success(`تم توليد ${usernames.length} يوزر جديد لم يتم فحصه من قبل`);
      }

      setGeneratedUsernames(usernames);
    } catch (error: any) {
      console.error("Error generating usernames:", error);
      toast.error("خطأ في التوليد", {
        description: error.message
      });
    }
  };

  const handleCheckAll = async () => {
    if (!canCheck) {
      toast.error("يجب الانتظار قبل الفحص التالي", {
        description: `الوقت المتبقي: ${timeRemaining}`,
      });
      return;
    }

    if (generatedUsernames.length === 0) {
      toast.error("لا توجد يوزرات للفحص");
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

      // Update cooldown
      await supabase.rpc("update_last_check", { p_user_id: user.id });
      await checkCooldown();

      setLoading(true);
      toast.info("جاري الفحص...", {
        description: "قد يستغرق هذا بعض الوقت",
      });

      // Check all usernames with 10 second delay between each
      for (let i = 0; i < generatedUsernames.length; i++) {
        setGeneratedUsernames(prev =>
          prev.map((u, idx) =>
            idx === i ? { ...u, checking: true } : u
          )
        );

        try {
          const { data, error } = await supabase.functions.invoke("check-discord-username", {
            body: {
              username: generatedUsernames[i].username,
              userId: user.id,
            },
          });

          if (error) throw error;

          setGeneratedUsernames(prev =>
            prev.map((u, idx) =>
              idx === i ? { ...u, checking: false, available: data.success ? data.available : null } : u
            )
          );

          if (data.success && data.available) {
            toast.success(`${generatedUsernames[i].username} متاح! ✓`);
          }
        } catch (error: any) {
          console.error("Error checking username:", error);
          setGeneratedUsernames(prev =>
            prev.map((u, idx) =>
              idx === i ? { ...u, checking: false, available: null } : u
            )
          );
        }

        if (i < generatedUsernames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      }

      toast.success("تم الفحص بنجاح!");
    } catch (error: any) {
      console.error("Error checking usernames:", error);
      toast.error("حدث خطأ أثناء الفحص");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResults = () => {
    const available = generatedUsernames.filter(u => u.available === true);
    if (available.length === 0) {
      toast.error("لا توجد يوزرات متاحة للحفظ");
      return;
    }

    const text = available.map(u => u.username).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `available-usernames-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`تم حفظ ${available.length} يوزر`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary" />
            توليد يوزرات
          </h1>
          <p className="text-text-muted mt-1">
            ولّد يوزرات Discord مخصصة وافحص توفرها
          </p>
        </div>

        {!canCheck && (
          <Card className="bg-warning/10 border-warning">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-warning flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">انتظر قبل الفحص التالي</h3>
                  <p className="text-sm text-text-muted">الوقت المتبقي: {timeRemaining}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings */}
          <Card className="bg-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle>إعدادات التوليد</CardTitle>
              <CardDescription>خصص يوزراتك المولدة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>عدد اليوزرات: {count[0]}</Label>
                <Slider
                  value={count}
                  onValueChange={setCount}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>الحد الأدنى للطول: {minLength[0]}</Label>
                <Slider
                  value={minLength}
                  onValueChange={setMinLength}
                  min={3}
                  max={12}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>الحد الأقصى للطول: {maxLength[0]}</Label>
                <Slider
                  value={maxLength}
                  onValueChange={setMaxLength}
                  min={minLength[0]}
                  max={12}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="prefix">بادئة (اختياري)</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 3))}
                  placeholder="مثال: abc"
                  className="discord-input mt-1"
                  maxLength={3}
                />
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label>أرقام</Label>
                  <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>حروف</Label>
                  <Switch checked={includeLetters} onCheckedChange={setIncludeLetters} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>نقاط (.)</Label>
                  <Switch checked={includeDots} onCheckedChange={setIncludeDots} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>شرطات سفلية (_)</Label>
                  <Switch checked={includeUnderscores} onCheckedChange={setIncludeUnderscores} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>يبدأ بحرف</Label>
                  <Switch checked={startWithLetter} onCheckedChange={setStartWithLetter} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>ينتهي بحرف</Label>
                  <Switch checked={endWithLetter} onCheckedChange={setEndWithLetter} />
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full discord-button bg-primary hover:bg-primary/90"
              >
                <Wand2 className="h-5 w-5" />
                توليد
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>اليوزرات المولدة</CardTitle>
                  <CardDescription>
                    {generatedUsernames.length} يوزر مولد
                  </CardDescription>
                </div>
                {generatedUsernames.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCheckAll}
                      disabled={loading || !canCheck}
                      className="discord-button bg-success hover:bg-success/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          جاري الفحص...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          فحص الكل
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSaveResults}
                      variant="outline"
                      className="border-border"
                    >
                      <Download className="h-4 w-4" />
                      تصدير
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedUsernames.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Wand2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    لم يتم التوليد بعد
                  </h3>
                  <p className="text-text-muted">
                    اضبط الإعدادات واضغط على زر التوليد
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {generatedUsernames.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        item.available === true
                          ? "border-success bg-success/10"
                          : item.available === false
                          ? "border-destructive bg-destructive/10"
                          : "border-border bg-background-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.checking ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                        ) : item.available === true ? (
                          <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        ) : item.available === false ? (
                          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-text-muted flex-shrink-0" />
                        )}
                        <span className="text-sm font-mono truncate">
                          {item.username}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Generator;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Key, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Wand2,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load stats
      const { data: statsData } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setStats(statsData);

      // Load tokens
      const { data: tokensData } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setTokens(tokensData || []);

      // Load subscription
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSubscription(subData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeTokensCount = tokens.filter(t => t.is_active).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted">جاري تحميل لوحة التحكم...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Check if user has no tokens
  if (tokens.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Key className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              مرحباً في لوحة التحكم!
            </h1>
            <p className="text-text-muted text-lg">
              للبدء، أضف توكن Discord الخاص بك لفحص اليوزرات المتاحة
            </p>
          </div>

          <Card className="bg-card border-border shadow-lg animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                ما هو التوكن؟
              </CardTitle>
              <CardDescription>
                التوكن هو مفتاح يسمح للموقع بالتحقق من توفر اليوزرات عبر Discord API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background-accent/50 p-4 rounded-lg space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">احصل على التوكن</h3>
                    <p className="text-sm text-text-muted">
                      سجل دخول إلى Discord واحصل على توكن حسابك
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">أضف التوكن</h3>
                    <p className="text-sm text-text-muted">
                      أضف التوكن إلى قائمة التوكنات الخاصة بك
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">ابدأ الفحص</h3>
                    <p className="text-sm text-text-muted">
                      ولّد وافحص يوزرات Discord المتاحة
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/dashboard/tokens")}
                className="w-full discord-button bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Key className="h-5 w-5" />
                إضافة توكن
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-text-muted mt-1">
              مرحباً بك! إليك نظرة عامة على نشاطك
            </p>
          </div>
          <Button
            onClick={() => navigate("/dashboard/generator")}
            className="discord-button bg-primary hover:bg-primary/90"
          >
            <Wand2 className="h-5 w-5" />
            توليد يوزرات
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-200 ease-out">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">إجمالي الفحوصات</p>
                  <p className="text-3xl font-bold text-foreground">{stats?.total_checks || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-success/50 transition-all duration-200 ease-out">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">يوزرات متاحة</p>
                  <p className="text-3xl font-bold text-success">{stats?.available_found || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-blurple/50 transition-all duration-200 ease-out">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">توكنات نشطة</p>
                  <p className="text-3xl font-bold text-foreground">{activeTokensCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blurple/10 flex items-center justify-center">
                  <Key className="h-6 w-6 text-blurple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(
            "bg-card border-border transition-all duration-200 ease-out",
            subscription?.plan_type === "premium"
              ? "hover:border-success/50"
              : "hover:border-warning/50"
          )}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">الخطة الحالية</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    subscription?.plan_type === "premium" ? "text-success" : "text-foreground"
                  )}>
                    {subscription?.plan_type === "premium" ? "بريميوم" : "مجاني"}
                  </p>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  subscription?.plan_type === "premium" ? "bg-success/10" : "bg-warning/10"
                )}>
                  <Zap className={cn(
                    "h-6 w-6",
                    subscription?.plan_type === "premium" ? "text-success" : "text-warning"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card border-border hover:border-primary/50 transition-all duration-200 ease-out">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                توليد يوزرات
              </CardTitle>
              <CardDescription>
                ابدأ بتوليد يوزرات جديدة وفحص توفرها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/dashboard/generator")}
                className="w-full discord-button bg-primary hover:bg-primary/90"
              >
                ابدأ الآن
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-success/50 transition-all duration-200 ease-out">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-success" />
                سجل الفحوصات
              </CardTitle>
              <CardDescription>
                تصفح سجل فحوصاتك السابقة والنتائج
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/dashboard/history")}
                variant="outline"
                className="w-full discord-button border-border hover:bg-background-accent"
              >
                عرض السجل
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Banner */}
        {subscription?.plan_type !== "premium" && (
          <Card className="bg-gradient-to-br from-primary/10 to-blurple/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    ترقية إلى البريميوم
                  </h3>
                  <p className="text-text-muted mb-4">
                    احصل على فحوصات كل 5 دقائق، وعدد غير محدود من التوكنات، وميزات حصرية أخرى
                  </p>
                  <Button
                    onClick={() => navigate("/dashboard/premium")}
                    className="discord-button bg-primary hover:bg-primary/90"
                  >
                    <Zap className="h-4 w-4" />
                    ترقية الآن
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

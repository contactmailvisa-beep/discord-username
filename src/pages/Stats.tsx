import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Zap, Clock, CheckCircle2, Key } from "lucide-react";

const Stats = () => {
  const [stats, setStats] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user stats
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
        .eq("user_id", user.id);

      setTokens(tokensData || []);

      // Load recent checks
      const { data: checksData } = await supabase
        .from("check_history")
        .select("*")
        .eq("user_id", user.id)
        .order("checked_at", { ascending: false })
        .limit(10);

      setRecentChecks(checksData || []);
    } catch (error: any) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const successRate = stats?.total_checks > 0
    ? ((stats.available_found / stats.total_checks) * 100).toFixed(1)
    : "0";

  const activeTokens = tokens.filter(t => t.is_active).length;
  const totalUsage = tokens.reduce((sum, t) => sum + (t.usage_count || 0), 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            الإحصائيات
          </h1>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-blurple/20 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">معدل النجاح</p>
                  <p className="text-4xl font-bold text-foreground">{successRate}%</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/20 to-success/10 border-success/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">يوزرات متاحة</p>
                  <p className="text-4xl font-bold text-success">{stats?.available_found || 0}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blurple/20 to-blurple/10 border-blurple/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">توكنات نشطة</p>
                  <p className="text-4xl font-bold text-blurple">{activeTokens}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-blurple/20 flex items-center justify-center">
                  <Key className="h-8 w-8 text-blurple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">استخدام التوكنات</p>
                  <p className="text-4xl font-bold text-warning">{totalUsage}</p>
                </div>
                <div className="w-14 h-14 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                أداء التوكنات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tokens.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted">لا توجد توكنات بعد</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div
                      key={token.id}
                      className="p-4 rounded-lg bg-background-secondary border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{token.token_name}</h4>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          token.is_active
                            ? "bg-success/20 text-success"
                            : "bg-muted/50 text-text-muted"
                        }`}>
                          {token.is_active ? "نشط" : "معطل"}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">الاستخدامات</span>
                        <span className="font-semibold text-foreground">{token.usage_count || 0}</span>
                      </div>
                      {token.last_used_at && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-text-muted">آخر استخدام</span>
                          <span className="text-text-muted">
                            {new Date(token.last_used_at).toLocaleDateString("ar")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentChecks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted">لا توجد فحوصات حديثة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentChecks.map((check) => (
                    <div
                      key={check.id}
                      className={`p-3 rounded-lg border ${
                        check.is_available
                          ? "border-success/30 bg-success/5"
                          : "border-border bg-background-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {check.is_available ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-destructive" />
                          )}
                          <span className="font-mono text-sm">{check.username_checked}</span>
                        </div>
                        <span className="text-xs text-text-muted">
                          {new Date(check.checked_at).toLocaleTimeString("ar")}
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

export default Stats;

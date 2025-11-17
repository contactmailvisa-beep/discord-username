import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, Crown, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      setUser(authUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      setProfile(profileData);

      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setSubscription(subData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthProvider = () => {
    if (user?.app_metadata?.provider === "google") return "Google";
    if (user?.app_metadata?.provider === "discord") return "Discord";
    return "البريد الإلكتروني";
  };

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
      <div className="space-y-6 animate-slide-up max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            الملف الشخصي
          </h1>
          <p className="text-text-muted mt-1">
            معلومات حسابك التفصيلية
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-card border-border">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {profile?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    @{profile?.username}
                  </h2>
                  {subscription?.plan_type === "premium" && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Crown className="h-3 w-3 mr-1" />
                      بريميوم
                    </Badge>
                  )}
                </div>
                <p className="text-text-muted">
                  {profile?.bio || "لا يوجد وصف"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              معلومات الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background-secondary">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-muted">البريد الإلكتروني</span>
                </div>
                <p className="text-foreground font-semibold">{user?.email}</p>
              </div>

              <div className="p-4 rounded-lg bg-background-secondary">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-muted">طريقة التسجيل</span>
                </div>
                <p className="text-foreground font-semibold">{getAuthProvider()}</p>
              </div>

              <div className="p-4 rounded-lg bg-background-secondary">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-muted">تاريخ الإنشاء</span>
                </div>
                <p className="text-foreground font-semibold">
                  {format(new Date(user?.created_at), "PPP", { locale: ar })}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background-secondary">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm text-text-muted">حالة البريد</span>
                </div>
                <p className="text-foreground font-semibold">
                  {user?.email_confirmed_at ? "موثق" : "غير موثق"}
                </p>
              </div>
            </div>

            {user?.user_metadata && Object.keys(user.user_metadata).length > 0 && (
              <div className="p-4 rounded-lg bg-background-secondary">
                <h3 className="font-semibold text-foreground mb-3">معلومات إضافية</h3>
                <div className="space-y-2">
                  {user.user_metadata.full_name && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">الاسم الكامل</span>
                      <span className="text-foreground">{user.user_metadata.full_name}</span>
                    </div>
                  )}
                  {user.user_metadata.provider_id && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">معرف المزود</span>
                      <span className="text-foreground font-mono text-sm">
                        {user.user_metadata.provider_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Info */}
        {subscription && (
          <Card className={`border ${
            subscription.plan_type === "premium"
              ? "bg-gradient-to-br from-primary/10 to-blurple/10 border-primary/30"
              : "bg-card border-border"
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                معلومات الاشتراك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background-secondary">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm text-text-muted">نوع الخطة</span>
                  </div>
                  <p className={`text-xl font-bold ${
                    subscription.plan_type === "premium" ? "text-primary" : "text-foreground"
                  }`}>
                    {subscription.plan_type === "premium" ? "بريميوم" : "مجاني"}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background-secondary">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm text-text-muted">الحالة</span>
                  </div>
                  <p className="text-xl font-bold text-success">
                    {subscription.status === "active" ? "نشط" : subscription.status}
                  </p>
                </div>

                {subscription.plan_type === "premium" && subscription.current_period_end && (
                  <div className="p-4 rounded-lg bg-background-secondary md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm text-text-muted">تاريخ التجديد</span>
                    </div>
                    <p className="text-foreground font-semibold">
                      {format(new Date(subscription.current_period_end), "PPP", { locale: ar })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

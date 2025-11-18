import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Crown, 
  CheckCircle2,
  Key,
  Sparkles,
  Clock,
  CreditCard,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { DiscordIcon } from "@/components/icons/DiscordIcon";

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

      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
      }
      setProfile(profileData);

      // Load subscription data (may not exist, that's ok)
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", authUser.id)
        .eq("status", "active")
        .maybeSingle();

      if (subError && subError.code !== "PGRST116") {
        console.error("Subscription error:", subError);
      }
      setSubscription(subData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthProviderIcon = () => {
    if (user?.app_metadata?.provider === "google") {
      return <GoogleIcon className="h-5 w-5" />;
    }
    if (user?.app_metadata?.provider === "discord") {
      return <DiscordIcon className="h-5 w-5 text-[#5865F2]" />;
    }
    return <Mail className="h-5 w-5 text-primary" />;
  };

  const getAuthProviderLabel = () => {
    if (user?.app_metadata?.provider === "google") return "Google";
    if (user?.app_metadata?.provider === "discord") return "Discord";
    return "البريد الإلكتروني";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isPremium = subscription?.plan === "premium" || subscription?.plan_type === "premium";

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Right Column - Account Information */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-border/50">
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 ring-2 ring-border">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {profile?.username?.charAt(0).toUpperCase() || <User className="h-8 w-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold">{profile?.username}</h2>
                      <div className="flex items-center gap-2">
                        {isPremium ? (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                            <Crown className="h-3 w-3 mr-1" />
                            بريميوم
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            مجاني
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  {/* Username */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">اسم المستخدم</p>
                      <p className="font-medium">{profile?.username}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                      <p className="font-medium text-sm break-all">{user?.email}</p>
                    </div>
                    {user?.email_confirmed_at && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Account Creation Date */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                      <p className="font-medium">
                        {format(new Date(user?.created_at), "dd MMMM yyyy", { locale: ar })}
                      </p>
                    </div>
                  </div>

                  {/* Auth Provider */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-primary/10">
                      {getAuthProviderIcon()}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">طريقة تسجيل الدخول</p>
                      <p className="font-medium">{getAuthProviderLabel()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Left Column - API Keys & Subscription */}
          <div className="space-y-6">
            {/* API Keys Section */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>مفاتيح API</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      إدارة مفاتيح الوصول للواجهة البرمجية
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ApiKeyManager />
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card className={`border-border/50 ${isPremium ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isPremium ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' : 'bg-primary/10'}`}>
                    {isPremium ? (
                      <Crown className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle>معلومات الاشتراك</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      تفاصيل خطة الاشتراك الحالية
                    </p>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Plan Type */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Sparkles className={`h-5 w-5 ${isPremium ? 'text-amber-600' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="text-sm text-muted-foreground">الخطة الحالية</p>
                        <p className="font-bold text-lg">
                          {isPremium ? "بريميوم" : "مجاني"}
                        </p>
                      </div>
                    </div>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        نشط
                      </Badge>
                    )}
                  </div>

                  {subscription && (
                    <>
                      {/* Start Date */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Clock className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">تاريخ البداية</p>
                          <p className="font-medium text-sm">
                            {format(new Date(subscription.created_at || subscription.start_date || subscription.current_period_start), "dd MMMM yyyy", { locale: ar })}
                          </p>
                        </div>
                      </div>

                      {/* End Date */}
                      {(subscription.current_period_end || subscription.end_date) && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">تاريخ الانتهاء</p>
                            <p className="font-medium text-sm">
                              {format(new Date(subscription.current_period_end || subscription.end_date), "dd MMMM yyyy", { locale: ar })}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Payment Method */}
                      {subscription.paypal_subscription_id && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">معرف الاشتراك</p>
                            <p className="font-medium text-xs font-mono break-all">
                              {subscription.paypal_subscription_id}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {!isPremium && (
                    <div className="p-4 rounded-lg border-2 border-dashed border-border bg-muted/30 text-center">
                      <Crown className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">ترقية إلى بريميوم</p>
                      <p className="text-xs text-muted-foreground">
                        احصل على ميزات إضافية مع الاشتراك المميز
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

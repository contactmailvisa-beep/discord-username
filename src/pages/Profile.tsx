import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { User, Mail, Calendar, Shield, Crown, CheckCircle2 } from "lucide-react";
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

  const getAuthProviderIcon = () => {
    if (user?.app_metadata?.provider === "google") {
      return <GoogleIcon className="h-6 w-6" />;
    }
    if (user?.app_metadata?.provider === "discord") {
      return <DiscordIcon className="h-6 w-6 text-[#5865F2]" />;
    }
    return <Mail className="h-6 w-6" />;
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
      <div className="min-h-screen p-4 md:p-8">
        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Right Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>
                      {profile?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile?.username}</CardTitle>
                    {profile?.bio && (
                      <p className="text-muted-foreground mt-1">{profile.bio}</p>
                    )}
                    {subscription && (
                      <Badge variant="secondary" className="mt-2">
                        {subscription.plan_type === "premium" ? "بريميوم" : "مجاني"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <Label>البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.email || "غير متوفر"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <Label>طريقة التسجيل</Label>
                    <div className="flex items-center gap-2">
                      {getAuthProviderIcon()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <Label>تاريخ الإنشاء</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString("ar-EG")
                        : "غير متوفر"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <Label>حالة البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.email_confirmed_at ? "مؤكد ✓" : "غير مؤكد"}
                    </p>
                  </div>
                </div>

                {user?.user_metadata && Object.keys(user.user_metadata).length > 0 && (
                  <div className="space-y-2">
                    <Label>معلومات إضافية</Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {user.user_metadata.full_name && (
                        <p>الاسم: {user.user_metadata.full_name}</p>
                      )}
                      {user.user_metadata.provider_id && (
                        <p>معرف المزود: {user.user_metadata.provider_id}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription Info */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الاشتراك</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>نوع الخطة</Label>
                    <p className="text-sm text-muted-foreground">
                      {subscription.plan_type === "premium" ? "بريميوم 💎" : "مجاني"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>الحالة</Label>
                    <Badge
                      variant={
                        subscription.status === "active" ? "default" : "secondary"
                      }
                    >
                      {subscription.status === "active" ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>

                  {subscription.current_period_end && (
                    <div className="space-y-2">
                      <Label>تاريخ التجديد</Label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(subscription.current_period_end).toLocaleDateString(
                          "ar-EG"
                        )}
                      </p>
                    </div>
                  )}

                  {subscription.plan_type === "premium" && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">مميزات البريميوم:</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• فحص كل 5 دقائق</li>
                        <li>• 100 طلب API يومياً</li>
                        <li>• أولوية في الدعم</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Left Column - API Keys */}
          <div>
            <ApiKeyManager />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

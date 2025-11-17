import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Crown, Zap, CheckCircle2, Clock, Infinity, Shield, Star, Key, Target, XCircle } from "lucide-react";

const Premium = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setSubscription(data);
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setProcessingPayment(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      toast.info("جاري فتح صفحة الدفع...", {
        description: "سيتم توجيهك إلى PayPal لإتمام الدفع",
      });

      // PayPal Subscribe Button URL
      const paypalUrl = new URL("https://www.paypal.com/cgi-bin/webscr");
      paypalUrl.searchParams.set("cmd", "_xclick-subscriptions");
      paypalUrl.searchParams.set("business", "tpnaltbn@gmail.com");
      paypalUrl.searchParams.set("item_name", "Premium Plan - Discord Username Checker");
      paypalUrl.searchParams.set("a3", "3"); // $3 per month
      paypalUrl.searchParams.set("p3", "1"); // every 1 period
      paypalUrl.searchParams.set("t3", "M"); // M = Monthly
      paypalUrl.searchParams.set("src", "1"); // recurring
      paypalUrl.searchParams.set("currency_code", "USD");
      paypalUrl.searchParams.set("custom", user.id); // user ID for tracking
      paypalUrl.searchParams.set("return", `${window.location.origin}/premium`);
      paypalUrl.searchParams.set("cancel_return", `${window.location.origin}/premium`);

      window.open(paypalUrl.toString(), "_blank");
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast.error("حدث خطأ في فتح صفحة الدفع");
    } finally {
      setProcessingPayment(false);
    }
  };

  const features = {
    free: [
      { icon: <Clock className="h-5 w-5" />, text: "فحص كل 15 دقيقة", included: true },
      { icon: <Target className="h-5 w-5" />, text: "10 يوزرات لكل فحص", included: true },
      { icon: <Key className="h-5 w-5" />, text: "توكنات غير محدودة", included: true },
      { icon: <Shield className="h-5 w-5" />, text: "حفظ السجلات", included: true },
      { icon: <Zap className="h-5 w-5" />, text: "فحص كل 5 دقائق", included: false },
      { icon: <Infinity className="h-5 w-5" />, text: "50 يوزر لكل فحص", included: false },
      { icon: <Star className="h-5 w-5" />, text: "أولوية في الدعم", included: false },
      { icon: <Crown className="h-5 w-5" />, text: "شارة البريميوم", included: false },
    ],
    premium: [
      { icon: <Clock className="h-5 w-5" />, text: "فحص كل 5 دقائق", included: true },
      { icon: <Target className="h-5 w-5" />, text: "50 يوزر لكل فحص", included: true },
      { icon: <Key className="h-5 w-5" />, text: "توكنات غير محدودة", included: true },
      { icon: <Shield className="h-5 w-5" />, text: "حفظ السجلات", included: true },
      { icon: <Zap className="h-5 w-5" />, text: "أولوية في المعالجة", included: true },
      { icon: <Infinity className="h-5 w-5" />, text: "توليد متقدم", included: true },
      { icon: <Star className="h-5 w-5" />, text: "أولوية في الدعم", included: true },
      { icon: <Crown className="h-5 w-5" />, text: "شارة البريميوم", included: true },
    ],
  };

  const isPremium = subscription?.plan_type === "premium";

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
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blurple mb-4">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            ترقية إلى البريميوم
          </h1>
          <p className="text-lg text-text-muted">
            احصل على وصول غير محدود وميزات حصرية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">الخطة المجانية</CardTitle>
                {!isPremium && (
                  <div className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
                    الحالية
                  </div>
                )}
              </div>
              <CardDescription className="text-xl font-bold text-foreground mt-2">
                مجاناً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 ${feature.included ? "text-success" : "text-text-muted opacity-50"}`}>
                      {feature.included ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`${feature.included ? "text-foreground" : "text-text-muted line-through"}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-gradient-to-br from-primary/20 to-blurple/20 border-primary relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blurple to-primary"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-primary" />
                  البريميوم
                </CardTitle>
                {isPremium && (
                  <div className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-semibold">
                    نشط
                  </div>
                )}
              </div>
              <CardDescription className="text-xl font-bold text-foreground mt-2">
                $3.00 <span className="text-base font-normal text-text-muted">/ شهرياً</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {features.premium.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>

              {!isPremium && (
                <Button
                  onClick={handleUpgrade}
                  className="w-full discord-button bg-primary hover:bg-primary/90 text-lg py-6"
                  disabled={processingPayment}
                >
                  <Crown className="h-5 w-5" />
                  ترقية الآن
                </Button>
              )}

              {isPremium && (
                <div className="text-center p-4 rounded-lg bg-success/10 border border-success">
                  <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="font-semibold text-success">أنت مشترك حالياً</p>
                  <p className="text-sm text-text-muted mt-1">
                    التجديد التالي: {subscription?.current_period_end 
                      ? new Date(subscription.current_period_end).toLocaleDateString("ar")
                      : "غير محدد"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Premium;

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed">("processing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      
      // Get payment parameters from URL
      const paymentId = searchParams.get("payment_id");
      const userId = searchParams.get("custom");
      const status = searchParams.get("status");

      // Check if payment was successful
      if (status === "success" || paymentId) {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPaymentStatus("failed");
          setMessage("يجب تسجيل الدخول أولاً");
          toast.error("يجب تسجيل الدخول");
          return;
        }

        // Check if subscription already exists
        const { data: existingSubscription } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        const currentDate = new Date();
        const periodStart = currentDate.toISOString();
        const periodEnd = new Date(currentDate.setMonth(currentDate.getMonth() + 1)).toISOString();

        if (existingSubscription) {
          // Update existing subscription
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              plan_type: "premium",
              status: "active",
              current_period_start: periodStart,
              current_period_end: periodEnd,
              paypal_subscription_id: paymentId || existingSubscription.paypal_subscription_id,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

          if (error) throw error;
        } else {
          // Create new subscription
          const { error } = await supabase
            .from("user_subscriptions")
            .insert({
              user_id: user.id,
              plan_type: "premium",
              status: "active",
              current_period_start: periodStart,
              current_period_end: periodEnd,
              paypal_subscription_id: paymentId,
            });

          if (error) throw error;
        }

        setPaymentStatus("success");
        setMessage("تم تفعيل الاشتراك البريميوم بنجاح!");
        toast.success("تم تفعيل الاشتراك!", {
          description: "تم تفعيل حسابك البريميوم لمدة شهر",
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } else {
        setPaymentStatus("failed");
        setMessage("فشلت عملية الدفع");
        toast.error("فشلت عملية الدفع", {
          description: "لم يتم استلام الدفع بنجاح",
          icon: <XCircle className="h-4 w-4" />,
        });
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setPaymentStatus("failed");
      setMessage("حدث خطأ في التحقق من الدفع");
      toast.error("خطأ في التحقق من الدفع", {
        description: error.message || "حاول مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (paymentStatus === "success") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard/premium");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-tertiary p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {loading ? (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            ) : paymentStatus === "success" ? (
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {loading ? "جاري التحقق من الدفع..." : paymentStatus === "success" ? "نجح الدفع!" : "فشل الدفع"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {message || "يرجى الانتظار..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && (
            <Button
              onClick={handleContinue}
              className="w-full discord-button bg-primary hover:bg-primary/90"
            >
              {paymentStatus === "success" ? "الذهاب إلى لوحة التحكم" : "إعادة المحاولة"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;

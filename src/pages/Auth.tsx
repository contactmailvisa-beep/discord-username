import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, LogIn, UserPlus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة", {
        description: "تأكد من تطابق كلمة المرور وتأكيدها",
      });
      return;
    }

    if (!isLogin && password.length < 6) {
      toast.error("كلمة مرور ضعيفة", {
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("تم تسجيل الدخول بنجاح!", {
          description: "مرحباً بك مجدداً",
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
        navigate("/dashboard");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;

        setOtpSent(true);
        toast.success("تم إرسال رمز التحقق", {
          description: "تحقق من بريدك الإلكتروني للحصول على رمز التحقق المكون من 6 أرقام",
          icon: <Mail className="h-4 w-4" />,
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error("حدث خطأ", {
        description: error.message || "تعذر إتمام العملية",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) throw error;

      toast.success("تم التحقق بنجاح!", {
        description: "يمكنك الآن اختيار اسم المستخدم الخاص بك",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      navigate("/select-username");
    } catch (error: any) {
      toast.error("رمز تحقق خاطئ", {
        description: error.message || "تحقق من الرمز وحاول مرة أخرى",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "discord") => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error("فشل تسجيل الدخول", {
        description: error.message,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    }
  };

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-tertiary p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">تحقق من بريدك الإلكتروني</h2>
              <p className="text-text-muted mt-2">
                أدخل رمز التحقق المكون من 6 أرقام
              </p>
            </div>

            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-text-muted">
                  رمز التحقق
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="discord-input mt-1 text-center text-xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full discord-button bg-primary hover:bg-primary/90"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    تحقق
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-tertiary p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground">
              {isLogin ? "مرحباً بعودتك!" : "إنشاء حساب"}
            </h2>
            <p className="text-text-muted mt-2">
              {isLogin
                ? "نحن سعداء برؤيتك مرة أخرى!"
                : "انضم إلينا لبدء فحص يوزرات Discord"}
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="email" className="text-text-muted">
                البريد الإلكتروني
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="discord-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-text-muted">
                كلمة المرور
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="discord-input pl-10"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-text-muted">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="discord-input pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full discord-button bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="h-4 w-4" />
                  تسجيل الدخول
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  إنشاء حساب
                </>
              )}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-text-muted">أو</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-14 h-14 rounded-full p-0 border-border hover:bg-background-accent transition-all"
              onClick={() => handleOAuthLogin("google")}
            >
              <GoogleIcon className="h-6 w-6" />
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-14 h-14 rounded-full p-0 border-border hover:bg-background-accent transition-all"
              onClick={() => handleOAuthLogin("discord")}
            >
              <DiscordIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-text-link hover:underline transition-all duration-200 ease-out"
            >
              {isLogin
                ? "ليس لديك حساب؟ سجل الآن"
                : "لديك حساب؟ سجل دخولك"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

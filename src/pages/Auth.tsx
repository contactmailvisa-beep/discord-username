import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, LogIn, UserPlus, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

type AuthStep = "email" | "otp" | "password";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>("email");
  const [otp, setOtp] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Try to sign in with password first
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If error is email not confirmed, send OTP
          if (error.message.includes("Email not confirmed") || error.message.includes("not confirmed")) {
            const { error: otpError } = await supabase.auth.signInWithOtp({
              email,
              options: {
                shouldCreateUser: false,
              }
            });

            if (otpError) throw otpError;

            setNeedsVerification(true);
            setAuthStep("otp");
            toast.success("أرسلنا رمز التحقق", {
              description: "حسابك غير مؤكد. تحقق من بريدك الإلكتروني للحصول على رمز التحقق",
              icon: <Mail className="h-4 w-4" />,
            });
          } else {
            throw error;
          }
        } else {
          toast.success("تم تسجيل الدخول بنجاح!", {
            description: "مرحباً بك مجدداً",
            icon: <CheckCircle2 className="h-4 w-4" />,
          });
          navigate("/dashboard");
        }
      } else {
        // For signup, send OTP first
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          }
        });

        if (error) throw error;

        setAuthStep("otp");
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
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (!isLogin) {
        // For new signups, move to password creation step
        setAuthStep("password");
        toast.success("تم التحقق بنجاح!", {
          description: "الآن قم بإنشاء كلمة مرور لحسابك",
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
      } else {
        // For existing users verifying their account
        toast.success("تم التحقق من حسابك!", {
          description: "يمكنك الآن الاستمرار",
          icon: <CheckCircle2 className="h-4 w-4" />,
        });
        
        // Check if user has username selected
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user?.id)
          .single();

        if (!profile?.username) {
          navigate("/select-username");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error("رمز تحقق خاطئ", {
        description: error.message || "تحقق من الرمز وحاول مرة أخرى",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة", {
        description: "تأكد من تطابق كلمة المرور وتأكيدها",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("كلمة مرور ضعيفة", {
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success("تم إنشاء الحساب بنجاح!", {
        description: "الآن اختر اسم المستخدم الخاص بك",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });
      
      navigate("/select-username");
    } catch (error: any) {
      toast.error("حدث خطأ", {
        description: error.message || "تعذر إنشاء كلمة المرور",
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

  const resetForm = () => {
    setAuthStep("email");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setNeedsVerification(false);
  };

  // OTP Verification Screen
  if (authStep === "otp") {
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
                أدخل رمز التحقق المكون من 6 أرقام المرسل إلى
              </p>
              <p className="text-primary font-medium mt-1">{email}</p>
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
                  autoFocus
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

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={resetForm}
              >
                العودة
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Password Creation Screen (for new signups after OTP)
  if (authStep === "password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-tertiary p-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">إنشاء كلمة مرور</h2>
              <p className="text-text-muted mt-2">
                اختر كلمة مرور قوية لحماية حسابك
              </p>
            </div>

            <form onSubmit={handlePasswordCreation} className="space-y-4">
              <div>
                <Label htmlFor="new-password" className="text-text-muted">
                  كلمة المرور
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="discord-input pl-10"
                    required
                    minLength={6}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-new-password" className="text-text-muted">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="discord-input pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full discord-button bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    إنشاء الحساب
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Email/Password Form
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

          <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
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

            {isLogin && (
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
            )}

            <Button
              type="submit"
              className="w-full discord-button bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
                </>
              )}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-text-muted">أو استمر مع</span>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-full border-border hover:bg-background-accent"
              onClick={() => handleOAuthLogin("google")}
            >
              <GoogleIcon className="h-6 w-6" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-full border-border hover:bg-background-accent"
              onClick={() => handleOAuthLogin("discord")}
            >
              <DiscordIcon className="h-6 w-6 text-[#5865F2]" />
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="text-sm text-text-link hover:underline"
            >
              {isLogin
                ? "ليس لديك حساب؟ سجل الآن"
                : "لديك حساب بالفعل؟ سجل دخولك"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

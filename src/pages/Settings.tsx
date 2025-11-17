import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings as SettingsIcon, Lock, Trash2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("كلمة مرور ضعيفة", {
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("كلمات المرور غير متطابقة", {
        description: "تأكد من تطابق كلمة المرور وتأكيدها",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("تم تغيير كلمة المرور بنجاح!", {
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      toast.error("خطأ في تغيير كلمة المرور", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه!"
    );

    if (!confirmed) return;

    const doubleConfirm = confirm(
      "تأكيد نهائي: سيتم حذف جميع بياناتك بشكل دائم. هل تريد المتابعة؟"
    );

    if (!doubleConfirm) return;

    setDeleting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete all user data
      await Promise.all([
        supabase.from("user_tokens").delete().eq("user_id", user.id),
        supabase.from("check_history").delete().eq("user_id", user.id),
        supabase.from("saved_usernames").delete().eq("user_id", user.id),
        supabase.from("user_stats").delete().eq("user_id", user.id),
        supabase.from("check_cooldowns").delete().eq("user_id", user.id),
        supabase.from("user_subscriptions").delete().eq("user_id", user.id),
        supabase.from("profiles").delete().eq("id", user.id),
      ]);

      // Sign out (Supabase doesn't allow deleting auth users from client)
      await supabase.auth.signOut();

      toast.success("تم حذف حسابك");
      navigate("/auth");
    } catch (error: any) {
      toast.error("خطأ في حذف الحساب", {
        description: error.message,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-slide-up max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            الإعدادات
          </h1>
          <p className="text-text-muted mt-1">
            إدارة حسابك وإعداداتك
          </p>
        </div>

        {/* Change Password */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              تغيير كلمة المرور
            </CardTitle>
            <CardDescription>
              قم بتحديث كلمة المرور الخاصة بك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="text-text-muted">
                  كلمة المرور الجديدة
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="discord-input mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmNewPassword" className="text-text-muted">
                  تأكيد كلمة المرور الجديدة
                </Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="discord-input mt-1"
                  required
                />
              </div>

              <Button
                type="submit"
                className="discord-button bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    تحديث كلمة المرور
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              منطقة الخطر
            </CardTitle>
            <CardDescription>
              إجراءات لا يمكن التراجع عنها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <h3 className="font-semibold text-foreground mb-2">حذف الحساب</h3>
                <p className="text-sm text-text-muted mb-4">
                  سيتم حذف جميع بياناتك بشكل دائم بما في ذلك التوكنات والسجلات واليوزرات المحفوظة
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  disabled={deleting}
                  className="discord-button"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      حذف الحساب نهائياً
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

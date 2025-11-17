import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Key, Plus, Trash2, Edit, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface Token {
  id: string;
  token_name: string;
  token_value: string;
  is_active: boolean;
  last_used_at: string | null;
  usage_count: number;
  created_at: string;
}

const Tokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<Token | null>(null);
  const [tokenName, setTokenName] = useState("");
  const [tokenValue, setTokenValue] = useState("");

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error: any) {
      toast.error("خطأ في تحميل التوكنات", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToken = async () => {
    if (!tokenName.trim() || !tokenValue.trim()) {
      toast.error("بيانات غير مكتملة", {
        description: "يرجى إدخال اسم التوكن والقيمة",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingToken) {
        const { error } = await supabase
          .from("user_tokens")
          .update({
            token_name: tokenName,
            token_value: tokenValue,
          })
          .eq("id", editingToken.id);

        if (error) throw error;
        toast.success("تم تحديث التوكن بنجاح");
      } else {
        const { error } = await supabase
          .from("user_tokens")
          .insert({
            user_id: user.id,
            token_name: tokenName,
            token_value: tokenValue,
            is_active: true,
          });

        if (error) throw error;

        // Update stats
        const { data: statsData } = await supabase
          .from("user_stats")
          .select("tokens_added")
          .eq("user_id", user.id)
          .single();

        if (statsData) {
          await supabase
            .from("user_stats")
            .update({ tokens_added: (statsData.tokens_added || 0) + 1 })
            .eq("user_id", user.id);
        }

        toast.success("تم إضافة التوكن بنجاح");
      }

      setDialogOpen(false);
      setTokenName("");
      setTokenValue("");
      setEditingToken(null);
      loadTokens();
    } catch (error: any) {
      toast.error("خطأ في حفظ التوكن", {
        description: error.message,
      });
    }
  };

  const handleDeleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from("user_tokens")
        .delete()
        .eq("id", tokenId);

      if (error) throw error;
      toast.success("تم حذف التوكن");
      loadTokens();
    } catch (error: any) {
      toast.error("خطأ في حذف التوكن", {
        description: error.message,
      });
    }
  };

  const handleToggleActive = async (tokenId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("user_tokens")
        .update({ is_active: !isActive })
        .eq("id", tokenId);

      if (error) throw error;
      toast.success(isActive ? "تم تعطيل التوكن" : "تم تفعيل التوكن");
      loadTokens();
    } catch (error: any) {
      toast.error("خطأ في تحديث التوكن", {
        description: error.message,
      });
    }
  };

  const openEditDialog = (token: Token) => {
    setEditingToken(token);
    setTokenName(token.token_name);
    setTokenValue(token.token_value);
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingToken(null);
    setTokenName("");
    setTokenValue("");
    setDialogOpen(true);
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
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Key className="h-8 w-8 text-primary" />
              إدارة التوكنات
            </h1>
            <p className="text-text-muted mt-1">
              أضف وأدر توكنات Discord الخاصة بك للفحص
            </p>
          </div>
          <Button
            onClick={openAddDialog}
            className="discord-button bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            إضافة توكن
          </Button>
        </div>

        {tokens.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <Key className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                لا توجد توكنات بعد
              </h3>
              <p className="text-text-muted mb-6 max-w-md mx-auto">
                أضف أول توكن Discord للبدء في فحص اليوزرات المتاحة
              </p>
              <Button
                onClick={openAddDialog}
                className="discord-button bg-primary hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                إضافة توكن
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tokens.map((token) => (
              <Card key={token.id} className="bg-card border-border hover:border-primary/30 transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Key className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {token.token_name}
                        </h3>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          token.is_active
                            ? "bg-success/20 text-success"
                            : "bg-muted/50 text-text-muted"
                        }`}>
                          {token.is_active ? "نشط" : "معطل"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          استخدم {token.usage_count} مرة
                        </span>
                        {token.last_used_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            آخر استخدام: {new Date(token.last_used_at).toLocaleDateString("ar")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch
                        checked={token.is_active}
                        onCheckedChange={() => handleToggleActive(token.id, token.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(token)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteToken(token.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingToken ? "تعديل التوكن" : "إضافة توكن جديد"}
              </DialogTitle>
              <DialogDescription>
                أدخل اسماً وصفياً وقيمة التوكن الخاص بك
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="tokenName" className="text-text-muted">
                  اسم التوكن
                </Label>
                <Input
                  id="tokenName"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="مثال: حساب أساسي"
                  className="discord-input mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tokenValue" className="text-text-muted">
                  قيمة التوكن
                </Label>
                <Input
                  id="tokenValue"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                  placeholder="أدخل توكن Discord"
                  className="discord-input mt-1"
                  type="password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-border"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleAddToken}
                className="discord-button bg-primary hover:bg-primary/90"
              >
                {editingToken ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Tokens;

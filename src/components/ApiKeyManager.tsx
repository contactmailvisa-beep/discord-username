import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Key, Copy, RefreshCw, Trash2, Edit2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";

interface ApiKey {
  id: string;
  api_key: string;
  label: string;
  created_at: string;
  last_used_at: string | null;
  requests_today: number;
  daily_limit: number;
  status: string;
  rate_limit: number;
  last_request_at: string | null;
}

interface ApiBan {
  is_banned: boolean;
  expires_at: string | null;
  reason: string | null;
}

export const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [editDialog, setEditDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [banInfo, setBanInfo] = useState<ApiBan | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
    checkBanStatus();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const checkBanStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc("is_api_banned", { check_user_id: user.id })
        .single();

      if (error) throw error;
      
      if (data && data.is_banned) {
        setBanInfo(data);
        const expiresAt = new Date(data.expires_at).getTime();
        const now = Date.now();
        const remaining = Math.floor((expiresAt - now) / 1000);
        if (remaining > 0) {
          setCooldown(remaining);
        }
      }
    } catch (error: any) {
      console.error("Error checking ban status:", error);
    }
  };

  const loadApiKeys = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewKey = async () => {
    if (banInfo?.is_banned) {
      toast({
        title: "محظور",
        description: "لا يمكنك إنشاء مفاتيح API جديدة حالياً",
        variant: "destructive",
      });
      return;
    }

    const lastKey = apiKeys[0];
    if (lastKey?.created_at) {
      const lastCreated = new Date(lastKey.created_at).getTime();
      const now = Date.now();
      const diff = (now - lastCreated) / 1000;
      if (diff < 60) {
        const wait = Math.ceil(60 - diff);
        toast({
          title: "انتظر قليلاً",
          description: `يجب الانتظار ${wait} ثانية قبل إنشاء مفتاح جديد`,
          variant: "destructive",
        });
        return;
      }
    }

    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: newKey, error: keyGenError } = await supabase
        .rpc("generate_api_key")
        .single();

      if (keyGenError) throw keyGenError;

      const { error: insertError } = await supabase
        .from("api_keys")
        .insert({
          user_id: user.id,
          api_key: newKey,
          label: "My API Key",
        });

      if (insertError) throw insertError;

      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء مفتاح API جديد بنجاح",
      });

      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const resetKey = async (keyId: string) => {
    if (banInfo?.is_banned) {
      toast({
        title: "محظور",
        description: "لا يمكنك إعادة تعيين المفاتيح حالياً",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: newKey, error: keyGenError } = await supabase
        .rpc("generate_api_key")
        .single();

      if (keyGenError) throw keyGenError;

      const { error } = await supabase
        .from("api_keys")
        .update({ api_key: newKey, last_used_at: null, requests_today: 0 })
        .eq("id", keyId);

      if (error) throw error;

      toast({
        title: "تم إعادة التعيين",
        description: "تم إعادة تعيين المفتاح بنجاح",
      });

      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const revokeKey = async (keyId: string) => {
    if (banInfo?.is_banned) {
      toast({
        title: "محظور",
        description: "لا يمكنك إلغاء المفاتيح حالياً",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ status: "revoked" })
        .eq("id", keyId);

      if (error) throw error;

      toast({
        title: "تم الإلغاء",
        description: "تم إلغاء المفتاح بنجاح",
      });

      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateLabel = async () => {
    if (!selectedKey || banInfo?.is_banned) return;

    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ label: newLabel })
        .eq("id", selectedKey.id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث الاسم بنجاح",
      });

      setEditDialog(false);
      loadApiKeys();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ المفتاح إلى الحافظة",
    });
  };

  const formatDate = (date: string | null) => {
    if (!date) return "لم يتم الاستخدام بعد";
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      {banInfo?.is_banned && cooldown > 0 && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">تم حظر وصولك لـ API</p>
                <p className="text-sm">{banInfo.reason}</p>
                <p className="text-sm mt-1">
                  الوقت المتبقي: {Math.floor(cooldown / 60)} دقيقة {cooldown % 60} ثانية
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">مفاتيح API</h3>
          <p className="text-sm text-muted-foreground">إدارة مفاتيح الوصول لـ API</p>
        </div>
        <Button
          onClick={generateNewKey}
          disabled={generating || (banInfo?.is_banned && cooldown > 0)}
          className="gap-2"
        >
          <Key className="h-4 w-4" />
          إنشاء مفتاح جديد
        </Button>
      </div>

      <div className="grid gap-4">
        {apiKeys.map((key) => (
          <Card key={key.id} className={key.status === "revoked" ? "opacity-50" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{key.label}</CardTitle>
                  <CardDescription>
                    تم الإنشاء: {formatDate(key.created_at)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedKey(key);
                      setNewLabel(key.label);
                      setEditDialog(true);
                    }}
                    disabled={key.status === "revoked" || (banInfo?.is_banned && cooldown > 0)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => resetKey(key.id)}
                    disabled={key.status === "revoked" || (banInfo?.is_banned && cooldown > 0)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => revokeKey(key.id)}
                    disabled={key.status === "revoked" || (banInfo?.is_banned && cooldown > 0)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted p-3 rounded text-sm font-mono">
                  {showKey[key.id] ? key.api_key : "•".repeat(32)}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setShowKey({ ...showKey, [key.id]: !showKey[key.id] })}
                >
                  {showKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(key.api_key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">آخر استخدام</p>
                  <p className="font-medium">{formatDate(key.last_used_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">الطلبات اليوم</p>
                  <p className="font-medium">
                    {key.requests_today} / {key.daily_limit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">الحالة</p>
                  <p className="font-medium">
                    {key.status === "active" ? "نشط" : "ملغي"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">معدل التحديد</p>
                  <p className="font-medium">{key.rate_limit} ثانية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {apiKeys.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">لا توجد مفاتيح API بعد</p>
              <p className="text-sm text-muted-foreground mt-2">
                قم بإنشاء مفتاح API للبدء في استخدام الخدمة
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل اسم المفتاح</DialogTitle>
            <DialogDescription>قم بتحديث اسم المفتاح لسهولة التعرف عليه</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">الاسم</Label>
              <Input
                id="label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="My API Key"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={updateLabel}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

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
      if (!user) return;

      const { data, error } = await supabase
        .rpc("generate_api_key");

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم إنشاء مفتاح API جديد",
      });

      await loadApiKeys();
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .rpc("generate_api_key");

      if (error) throw error;

      await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyId);

      toast({
        title: "نجح",
        description: "تم إعادة تعيين المفتاح",
      });

      await loadApiKeys();
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
        description: "لا يمكنك حذف المفاتيح حالياً",
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
        title: "نجح",
        description: "تم إلغاء المفتاح",
      });

      await loadApiKeys();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateLabel = async () => {
    if (!selectedKey) return;

    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ label: newLabel })
        .eq("id", selectedKey.id);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم تحديث التسمية",
      });

      setEditDialog(false);
      await loadApiKeys();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "نجح",
      description: message,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const expires = new Date(expiresAt).getTime();
    const now = Date.now();
    const diff = expires - now;
    
    if (diff <= 0) return "انتهى";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} يوم ${hours} ساعة`;
    if (hours > 0) return `${hours} ساعة ${minutes} دقيقة`;
    return `${minutes} دقيقة`;
  };

  if (loading) {
    return <div className="text-center py-4 text-xs">جاري التحميل...</div>;
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Key className="h-4 w-4" />
          مفاتيح API
        </CardTitle>
        <CardDescription className="text-xs">
          أنشئ وأدِر مفاتيح API الخاصة بك
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {banInfo?.is_banned && banInfo.expires_at && (
          <div className="p-3 border border-destructive rounded-lg bg-destructive/10">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive text-sm">حسابك محظور مؤقتاً</p>
                <p className="text-xs text-muted-foreground mt-1">{banInfo.reason}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ينتهي الحظر بعد: {formatTimeRemaining(banInfo.expires_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={generateNewKey}
          disabled={generating || cooldown > 0 || (banInfo?.is_banned ?? false)}
          className="w-full text-sm"
          size="sm"
        >
          <Key className="mr-2 h-3 w-3" />
          {generating ? "جاري الإنشاء..." : cooldown > 0 ? `انتظر ${cooldown}ث` : "إنشاء مفتاح جديد"}
        </Button>

        {apiKeys.length === 0 ? (
          <p className="text-center text-muted-foreground text-xs py-6">
            لا توجد مفاتيح API بعد. قم بإنشاء واحد للبدء.
          </p>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((key) => (
              <Card key={key.id} className="bg-background-secondary">
                <CardContent className="pt-4 pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{key.label || "مفتاح API"}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(key.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          setSelectedKey(key);
                          setNewLabel(key.label);
                          setEditDialog(true);
                        }}
                        disabled={banInfo?.is_banned ?? false}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => resetKey(key.id)}
                        disabled={banInfo?.is_banned ?? false}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => revokeKey(key.id)}
                        disabled={banInfo?.is_banned ?? false}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-1">
                      <Input
                        value={showKey[key.id] ? key.api_key : "•".repeat(32)}
                        readOnly
                        className="font-mono text-[10px] h-8"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowKey(prev => ({ ...prev, [key.id]: !prev[key.id] }))}
                      >
                        {showKey[key.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(key.api_key, "تم نسخ المفتاح")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">الطلبات اليوم</p>
                        <p className="font-medium">{key.requests_today} / {key.daily_limit}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">آخر استخدام</p>
                        <p className="font-medium">
                          {key.last_used_at ? formatDate(key.last_used_at) : "لم يُستخدم"}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">الحالة</p>
                        <p className="font-medium">{key.status === "active" ? "نشط" : "معطل"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground">الحد الزمني</p>
                        <p className="font-medium">{key.rate_limit}ث</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل تسمية المفتاح</DialogTitle>
            <DialogDescription>
              أدخل تسمية جديدة لمفتاح API
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="label">التسمية</Label>
            <Input
              id="label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="مفتاح API الخاص بي"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={updateLabel}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Ban, Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApiLog {
  id: string;
  api_key_id: string;
  user_id: string;
  endpoint: string;
  token_name: string | null;
  usernames_checked: any;
  results: any;
  status_code: number;
  ip_address: string | null;
  user_agent: string | null;
  error_message: string | null;
  created_at: string;
  processing_time: number | null;
  profiles: {
    username: string;
    email: string | null;
    avatar_url: string | null;
  };
}

export default function FounderLogs() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [banDialog, setBanDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("1h");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

      if (profile?.email === "flepower7@gmail.com") {
        setIsAdmin(true);
        loadLogs();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      navigate("/dashboard");
    } finally {
      setCheckingAuth(false);
    }
  };

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("api_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Load profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((log: any) => log.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username, email, avatar_url")
          .in("id", userIds);
        
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]));
        const logsWithProfiles = data.map((log: any) => ({
          ...log,
          profiles: profilesMap.get(log.user_id) || { username: "Unknown", email: null, avatar_url: null },
        }));
        
        setLogs(logsWithProfiles);
      } else {
        setLogs([]);
      }
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

  const handleBan = async () => {
    if (!selectedUser || !banReason) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let expiresAt = new Date();
      switch (banDuration) {
        case "1h":
          expiresAt.setHours(expiresAt.getHours() + 1);
          break;
        case "1d":
          expiresAt.setDate(expiresAt.getDate() + 1);
          break;
        case "1w":
          expiresAt.setDate(expiresAt.getDate() + 7);
          break;
        case "1m":
          expiresAt.setMonth(expiresAt.getMonth() + 1);
          break;
      }

      const { error } = await supabase.from("api_bans").insert({
        user_id: selectedUser.id,
        banned_by: user.id,
        reason: banReason,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      toast({
        title: "تم الحظر",
        description: `تم حظر ${selectedUser.username} بنجاح`,
      });

      setBanDialog(false);
      setBanReason("");
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredLogs = logs.filter((log) => {
    const search = searchTerm.toLowerCase();
    return (
      log.profiles?.username.toLowerCase().includes(search) ||
      log.profiles?.email?.toLowerCase().includes(search) ||
      log.ip_address?.toLowerCase().includes(search) ||
      log.endpoint.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return "bg-green-500/20 text-green-500";
    if (code >= 400 && code < 500) return "bg-yellow-500/20 text-yellow-500";
    return "bg-red-500/20 text-red-500";
  };

  if (checkingAuth || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">سجلات API - Founder</h1>
            <p className="text-muted-foreground">عرض وإدارة جميع طلبات API</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {log.profiles?.avatar_url && (
                      <img
                        src={log.profiles.avatar_url}
                        alt={log.profiles.username}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{log.profiles?.username}</CardTitle>
                      <CardDescription>{log.profiles?.email}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(log.status_code)}>
                      {log.status_code}
                    </Badge>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedUser({
                          id: log.user_id,
                          username: log.profiles?.username || "Unknown",
                        });
                        setBanDialog(true);
                      }}
                    >
                      <Ban className="h-4 w-4 ml-2" />
                      حظر
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Endpoint</p>
                    <p className="font-medium">{log.endpoint}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Token</p>
                    <p className="font-medium">{log.token_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IP</p>
                    <p className="font-medium">{log.ip_address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">وقت المعالجة</p>
                    <p className="font-medium">{log.processing_time || 0}ms</p>
                  </div>
                </div>

                {log.usernames_checked && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">اليوزرات المفحوصة:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(log.usernames_checked) ? (
                        log.usernames_checked.map((username: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {username}
                          </Badge>
                        ))
                      ) : null}
                    </div>
                  </div>
                )}

                {log.error_message && (
                  <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <p>{log.error_message}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(log.created_at).toLocaleString("ar-EG")}
                </p>
              </CardContent>
            </Card>
          ))}

          {filteredLogs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">لا توجد سجلات</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={banDialog} onOpenChange={setBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حظر مستخدم من API</DialogTitle>
            <DialogDescription>
              حظر {selectedUser?.username} من استخدام API
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">المدة</Label>
              <Select value={banDuration} onValueChange={setBanDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">ساعة واحدة</SelectItem>
                  <SelectItem value="1d">يوم واحد</SelectItem>
                  <SelectItem value="1w">أسبوع واحد</SelectItem>
                  <SelectItem value="1m">شهر واحد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reason">السبب</Label>
              <Textarea
                id="reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="سبب الحظر..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={!banReason}
            >
              حظر
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

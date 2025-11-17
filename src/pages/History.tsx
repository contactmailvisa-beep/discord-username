import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { History as HistoryIcon, CheckCircle2, XCircle, Download, Trash2, Search, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CheckRecord {
  id: string;
  username_checked: string;
  is_available: boolean;
  checked_at: string;
  response_time: number;
}

const History = () => {
  const [history, setHistory] = useState<CheckRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<CheckRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterHistory();
  }, [searchTerm, dateFilter, history]);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("check_history")
        .select("*")
        .eq("user_id", user.id)
        .order("checked_at", { ascending: false })
        .limit(1000);

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast.error("خطأ في تحميل السجل", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    let filtered = history;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.username_checked.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    const now = new Date();
    switch (dateFilter) {
      case "today":
        filtered = filtered.filter(record => {
          const date = new Date(record.checked_at);
          return date.toDateString() === now.toDateString();
        });
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(record =>
          new Date(record.checked_at) >= weekAgo
        );
        break;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(record =>
          new Date(record.checked_at) >= monthAgo
        );
        break;
    }

    setFilteredHistory(filtered);
  };

  const handleExport = (available: boolean) => {
    const records = filteredHistory.filter(r => r.is_available === available);
    if (records.length === 0) {
      toast.error("لا توجد نتائج للتصدير");
      return;
    }

    const text = records.map(r => r.username_checked).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${available ? "available" : "taken"}-usernames-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`تم تصدير ${records.length} يوزر`);
  };

  const handleClearHistory = async () => {
    if (!confirm("هل أنت متأكد من حذف السجل كاملاً؟")) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("check_history")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("تم مسح السجل");
      setHistory([]);
    } catch (error: any) {
      toast.error("خطأ في مسح السجل", {
        description: error.message,
      });
    }
  };

  const availableCount = filteredHistory.filter(r => r.is_available).length;
  const takenCount = filteredHistory.filter(r => !r.is_available).length;

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
              <HistoryIcon className="h-8 w-8 text-primary" />
              سجل الفحوصات
            </h1>
            <p className="text-text-muted mt-1">
              تاريخ فحوصاتك السابقة ونتائجها
            </p>
          </div>
          <Button
            onClick={handleClearHistory}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            مسح السجل
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-text-muted mb-2">إجمالي الفحوصات</p>
                <p className="text-4xl font-bold text-foreground">{filteredHistory.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-success/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-text-muted mb-2">متاح</p>
                <p className="text-4xl font-bold text-success">{availableCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-destructive/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-text-muted mb-2">مستخدم</p>
                <p className="text-4xl font-bold text-destructive">{takenCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن يوزرنيم..."
                    className="discord-input pr-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={dateFilter === "all" ? "default" : "outline"}
                  onClick={() => setDateFilter("all")}
                  className={dateFilter === "all" ? "bg-primary" : "border-border"}
                >
                  الكل
                </Button>
                <Button
                  variant={dateFilter === "today" ? "default" : "outline"}
                  onClick={() => setDateFilter("today")}
                  className={dateFilter === "today" ? "bg-primary" : "border-border"}
                >
                  اليوم
                </Button>
                <Button
                  variant={dateFilter === "week" ? "default" : "outline"}
                  onClick={() => setDateFilter("week")}
                  className={dateFilter === "week" ? "bg-primary" : "border-border"}
                >
                  أسبوع
                </Button>
                <Button
                  variant={dateFilter === "month" ? "default" : "outline"}
                  onClick={() => setDateFilter("month")}
                  className={dateFilter === "month" ? "bg-primary" : "border-border"}
                >
                  شهر
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleExport(true)}
                  variant="outline"
                  className="border-success text-success hover:bg-success/10"
                >
                  <Download className="h-4 w-4" />
                  تصدير المتاح
                </Button>
                <Button
                  onClick={() => handleExport(false)}
                  variant="outline"
                  className="border-border"
                >
                  <Download className="h-4 w-4" />
                  تصدير المستخدم
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <HistoryIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                لا توجد سجلات
              </h3>
              <p className="text-text-muted">
                {searchTerm || dateFilter !== "all"
                  ? "لم يتم العثور على نتائج للفلتر الحالي"
                  : "ابدأ بفحص يوزرات لرؤية السجل"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {filteredHistory.slice(0, 10).map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 rounded-lg border ${
                      record.is_available
                        ? "border-success/30 bg-success/5"
                        : "border-border bg-background-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {record.is_available ? (
                          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground font-mono">
                            {record.username_checked}
                          </p>
                          <p className="text-sm text-text-muted flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(record.checked_at), "PPp", { locale: ar })}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        record.is_available
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {record.is_available ? "متاح" : "مستخدم"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;

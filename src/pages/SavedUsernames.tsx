import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bookmark, Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

interface SavedUsername {
  id: string;
  username: string;
  notes: string | null;
  is_claimed: boolean;
  saved_at: string;
}

const SavedUsernames = () => {
  const [savedUsernames, setSavedUsernames] = useState<SavedUsername[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    loadSavedUsernames();
  }, []);

  const loadSavedUsernames = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_usernames")
        .select("*")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });

      if (error) throw error;
      setSavedUsernames(data || []);
    } catch (error: any) {
      console.error("Error loading saved usernames:", error);
      toast.error("فشل تحميل الأسماء المحفوظة");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("saved_usernames").delete().eq("id", id);
      if (error) throw error;
      setSavedUsernames(prev => prev.filter(u => u.id !== id));
      toast.success("تم حذف الاسم");
    } catch (error: any) {
      toast.error("فشل حذف الاسم");
    }
  };

  const handleUpdateNotes = async (id: string) => {
    try {
      const { error } = await supabase.from("saved_usernames").update({ notes: editNotes }).eq("id", id);
      if (error) throw error;
      setSavedUsernames(prev => prev.map(u => u.id === id ? { ...u, notes: editNotes } : u));
      setEditingId(null);
      setEditNotes("");
      toast.success("تم حفظ الملاحظات");
    } catch (error: any) {
      toast.error("فشل حفظ الملاحظات");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">اليوزرات المفضلة</h1>
          </div>

          <Card className="p-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{savedUsernames.length}</p>
              <p className="text-sm text-muted-foreground mt-2">إجمالي الأسماء المحفوظة</p>
            </div>
          </Card>

          {savedUsernames.length === 0 ? (
            <Card className="p-8 text-center">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">لا توجد أسماء محفوظة بعد</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {savedUsernames.map((username) => (
                <Card key={username.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{username.username}</h3>
                      {editingId === username.id ? (
                        <div className="space-y-2">
                          <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="أضف ملاحظات..." />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateNotes(username.id)}><Check className="h-4 w-4" /> حفظ</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /> إلغاء</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {username.notes && <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded mb-2">{username.notes}</p>}
                          <Button size="sm" variant="outline" onClick={() => { setEditingId(username.id); setEditNotes(username.notes || ""); }}>
                            <Edit2 className="h-4 w-4" /> {username.notes ? "تعديل" : "إضافة ملاحظات"}
                          </Button>
                        </>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">تم الحفظ: {new Date(username.saved_at).toLocaleDateString("ar-SA")}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(username.id)} className="text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedUsernames;

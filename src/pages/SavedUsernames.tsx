import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bookmark, Trash2, Edit2, Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      const { error } = await supabase
        .from("saved_usernames")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedUsernames(prev => prev.filter(u => u.id !== id));
      toast.success("تم حذف الاسم");
    } catch (error: any) {
      console.error("Error deleting username:", error);
      toast.error("فشل حذف الاسم");
    }
  };

  const handleToggleClaimed = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("saved_usernames")
        .update({ is_claimed: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setSavedUsernames(prev =>
        prev.map(u =>
          u.id === id ? { ...u, is_claimed: !currentStatus } : u
        )
      );
      toast.success(!currentStatus ? "تم تمييز الاسم كمأخوذ" : "تم تمييز الاسم كمتاح");
    } catch (error: any) {
      console.error("Error toggling claimed status:", error);
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleUpdateNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_usernames")
        .update({ notes: editNotes })
        .eq("id", id);

      if (error) throw error;

      setSavedUsernames(prev =>
        prev.map(u =>
          u.id === id ? { ...u, notes: editNotes } : u
        )
      );
      setEditingId(null);
      setEditNotes("");
      toast.success("تم حفظ الملاحظات");
    } catch (error: any) {
      console.error("Error updating notes:", error);
      toast.error("فشل حفظ الملاحظات");
    }
  };

  const startEditing = (id: string, currentNotes: string | null) => {
    setEditingId(id);
    setEditNotes(currentNotes || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditNotes("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">الأسماء المحفوظة</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الأسماء</p>
            <p className="text-2xl font-bold text-foreground">{savedUsernames.length}</p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-1">متاح</p>
            <p className="text-2xl font-bold text-green-500">
              {savedUsernames.filter(u => !u.is_claimed).length}
            </p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <p className="text-sm text-muted-foreground mb-1">مأخوذ</p>
            <p className="text-2xl font-bold text-red-500">
              {savedUsernames.filter(u => u.is_claimed).length}
            </p>
          </Card>
        </div>

        {/* Saved Usernames List */}
        {savedUsernames.length === 0 ? (
          <Card className="p-12 bg-card border-border text-center">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">لا توجد أسماء محفوظة</p>
            <p className="text-sm text-muted-foreground mt-2">
              ابدأ بحفظ الأسماء المتاحة من صفحة الفحص
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {savedUsernames.map((username) => (
              <Card
                key={username.id}
                className={`p-4 bg-card border-border transition-all hover:shadow-md ${
                  username.is_claimed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {username.username}
                      </h3>
                      {username.is_claimed ? (
                        <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-500 rounded">
                          مأخوذ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-500 rounded">
                          متاح
                        </span>
                      )}
                    </div>

                    {editingId === username.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="أضف ملاحظات..."
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateNotes(username.id)}
                            className="rounded-full"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            حفظ
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            className="rounded-full"
                          >
                            <X className="h-4 w-4 mr-1" />
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {username.notes && (
                          <p className="text-sm text-muted-foreground">{username.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          تم الحفظ: {new Date(username.saved_at).toLocaleDateString('ar-SA')}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleClaimed(username.id, username.is_claimed)}
                      className="rounded-full"
                      title={username.is_claimed ? "تمييز كمتاح" : "تمييز كمأخوذ"}
                    >
                      <Star className={`h-4 w-4 ${username.is_claimed ? "" : "fill-current"}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(username.id, username.notes)}
                      className="rounded-full"
                      disabled={editingId !== null}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(username.id)}
                      className="rounded-full"
                      disabled={editingId !== null}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedUsernames;

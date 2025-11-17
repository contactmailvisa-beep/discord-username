import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Trash2, Search, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

interface SearchResult {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
  hasPremium: boolean;
}

const RemovePremium = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== "flepower7@gmail.com") {
      toast.error("غير مصرح لك بالوصول لهذه الصفحة");
      navigate("/dashboard");
      return false;
    }
    return true;
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, email")
        .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;

      const results: SearchResult[] = [];
      for (const profile of profiles || []) {
        // التحقق من وجود اشتراك بريميوم
        const { data: subscription, error: subError } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", profile.id)
          .eq("plan_type", "premium")
          .eq("status", "active")
          .maybeSingle();

        // Log for debugging
        if (subError) {
          console.error("Error checking subscription:", subError);
        }

        results.push({
          id: profile.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          email: profile.email || '',
          hasPremium: !!subscription,
        });
      }

      // ترتيب النتائج: البريميوم أولاً
      setSearchResults(results.sort((a, b) => (b.hasPremium ? 1 : 0) - (a.hasPremium ? 1 : 0)));
    } catch (error: any) {
      console.error("Error searching users:", error);
      toast.error("خطأ في البحث عن المستخدمين");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: SearchResult) => {
    if (!user.hasPremium) {
      toast.error("هذا المستخدم ليس لديه اشتراك بريميوم نشط");
      return;
    }
    
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const handleRemovePremium = async () => {
    if (!await checkAdminAccess()) return;

    if (selectedUsers.length === 0) {
      toast.error("يرجى اختيار مستخدم واحد على الأقل");
      return;
    }

    setLoading(true);
    try {
      for (const user of selectedUsers) {
        // حذف أو تعطيل الاشتراك
        await supabase
          .from("user_subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      }

      toast.success(`تم إلغاء البريميوم لـ ${selectedUsers.length} مستخدم بنجاح`);
      setSelectedUsers([]);
    } catch (error: any) {
      console.error("Error removing premium:", error);
      toast.error("حدث خطأ أثناء إلغاء البريميوم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h1 className="text-3xl font-bold text-foreground">إلغاء البريميوم</h1>
            </div>
            <p className="text-text-muted">قم بإلغاء الاشتراك البريميوم للمستخدمين المحددين</p>
          </div>

          {/* Search Section */}
          <div className="bg-background-secondary border border-border rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Label className="text-foreground mb-3 block">البحث عن المستخدمين</Label>
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-text-muted" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                placeholder="ابحث بالايميل أو اسم المستخدم..."
                className="pr-10"
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background-secondary border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectUser(result)}
                      className="w-full p-3 hover:bg-background-tertiary transition-colors flex items-center gap-3 group"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                        <AvatarImage src={result.avatar_url || ""} />
                        <AvatarFallback>{result.username[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-foreground">{result.username}</p>
                        <p className="text-sm text-text-muted">{result.email}</p>
                      </div>
                      {result.hasPremium ? (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          بريميوم
                        </span>
                      ) : (
                        <span className="text-xs bg-muted text-text-muted px-2 py-1 rounded-full">
                          مجاني
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {searching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background-secondary border border-border rounded-lg p-4 text-center text-text-muted">
                  جاري البحث...
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted mt-2">💡 يمكنك اختيار المستخدمين الذين لديهم اشتراك بريميوم نشط فقط</p>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="bg-background-secondary border border-destructive/30 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Label className="text-foreground mb-4 block">المستخدمون المحددون ({selectedUsers.length})</Label>
              <div className="space-y-3">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 bg-background-tertiary p-3 rounded-lg group hover:bg-background/50 transition-all"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.username}</p>
                      <p className="text-sm text-text-muted">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                      className="hover:bg-destructive/20 hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleRemovePremium}
            disabled={loading || selectedUsers.length === 0}
            variant="destructive"
            className="w-full h-12 text-lg font-semibold animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                جاري الإلغاء...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                إلغاء البريميوم
              </div>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RemovePremium;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Plus, Search, Check } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
}

const AddPremium = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SearchResult[]>([]);
  const [duration, setDuration] = useState<string>("");
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

      const results: SearchResult[] = (profiles || []).map(profile => ({
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        email: profile.email || '',
      }));

      setSearchResults(results);
    } catch (error: any) {
      console.error("Error searching users:", error);
      toast.error("خطأ في البحث عن المستخدمين");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: SearchResult) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const calculateEndDate = (duration: string): Date => {
    const now = new Date();
    switch (duration) {
      case "1hour":
        return new Date(now.getTime() + 60 * 60 * 1000);
      case "1day":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case "1week":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case "1month":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return now;
    }
  };

  const handleAddPremium = async () => {
    if (!await checkAdminAccess()) return;

    if (selectedUsers.length === 0) {
      toast.error("يرجى اختيار مستخدم واحد على الأقل");
      return;
    }

    if (!duration) {
      toast.error("يرجى تحديد مدة الاشتراك");
      return;
    }

    setLoading(true);
    try {
      const endDate = calculateEndDate(duration);

      for (const user of selectedUsers) {
        // التحقق من وجود اشتراك حالي
        const { data: existingSub } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (existingSub) {
          // تحديث الاشتراك الموجود
          await supabase
            .from("user_subscriptions")
            .update({
              plan_type: "premium",
              status: "active",
              current_period_end: endDate.toISOString(),
              current_period_start: new Date().toISOString(),
              paypal_subscription_id: "PERMANENT_ADMIN_SUBSCRIPTION",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);
        } else {
          // إنشاء اشتراك جديد
          await supabase
            .from("user_subscriptions")
            .insert({
              user_id: user.id,
              plan_type: "premium",
              status: "active",
              current_period_start: new Date().toISOString(),
              current_period_end: endDate.toISOString(),
              paypal_subscription_id: "PERMANENT_ADMIN_SUBSCRIPTION",
            });
        }
      }

      toast.success(`تمت إضافة ${selectedUsers.length} مستخدم إلى البريميوم بنجاح`);
      setSelectedUsers([]);
      setDuration("");
    } catch (error: any) {
      console.error("Error adding premium:", error);
      toast.error("حدث خطأ أثناء إضافة البريميوم");
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
            <h1 className="text-3xl font-bold text-foreground mb-2">إضافة مستخدمين للبريميوم</h1>
            <p className="text-text-muted">قم بإضافة مستخدمين إلى الاشتراك البريميوم مع تحديد المدة</p>
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
                      <Check className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="bg-background-secondary border border-border rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
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

          {/* Duration Selection */}
          <div className="bg-background-secondary border border-border rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Label className="text-foreground mb-3 block">مدة الاشتراك</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المدة..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1hour">ساعة واحدة</SelectItem>
                <SelectItem value="1day">يوم واحد</SelectItem>
                <SelectItem value="1week">أسبوع واحد</SelectItem>
                <SelectItem value="1month">شهر واحد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAddPremium}
            disabled={loading || selectedUsers.length === 0 || !duration}
            className="w-full h-12 text-lg font-semibold animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                جاري الإضافة...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                إضافة للبريميوم
              </div>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPremium;

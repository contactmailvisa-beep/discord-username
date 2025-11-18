import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface SaveUsernameButtonProps {
  username: string;
  onSaved?: () => void;
}

export const SaveUsernameButton = ({ username, onSaved }: SaveUsernameButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfSaved();
  }, [username]);

  const checkIfSaved = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("saved_usernames")
        .select("id")
        .eq("user_id", user.id)
        .eq("username", username)
        .maybeSingle();

      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleToggleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("يجب تسجيل الدخول");
        return;
      }

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from("saved_usernames")
          .delete()
          .eq("user_id", user.id)
          .eq("username", username);

        if (error) throw error;

        setIsSaved(false);
        toast.success("تم إزالة الاسم من المفضلة");
      } else {
        // Add to saved
        const { error } = await supabase
          .from("saved_usernames")
          .insert({
            user_id: user.id,
            username: username,
            is_claimed: false,
            notes: null,
          });

        if (error) throw error;

        setIsSaved(true);
        toast.success("تم إضافة الاسم إلى المفضلة");
        onSaved?.();
      }
    } catch (error: any) {
      console.error("Error toggling save:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleSave}
      disabled={loading}
      className="h-8 w-8 rounded-full transition-all hover:bg-accent"
    >
      <Star
        className={`h-4 w-4 transition-all ${
          isSaved 
            ? "fill-yellow-500 text-yellow-500" 
            : "text-muted-foreground"
        }`}
      />
    </Button>
  );
};

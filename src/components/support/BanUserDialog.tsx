import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onBanComplete: () => void;
}

const BanUserDialog = ({ open, onOpenChange, userId, onBanComplete }: BanUserDialogProps) => {
  const [duration, setDuration] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleBan = async () => {
    if (!duration || !reason.trim()) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let expiresAt: Date | null = null;
      let isPermanent = false;

      if (duration === "permanent") {
        isPermanent = true;
      } else {
        const now = new Date();
        switch (duration) {
          case "1hour":
            expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
            break;
          case "1day":
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
          case "1week":
            expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case "1month":
            expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
        }
      }

      const { error } = await supabase
        .from("user_bans")
        .insert({
          user_id: userId,
          reason: reason.trim(),
          banned_by: user.id,
          expires_at: expiresAt?.toISOString(),
          is_permanent: isPermanent
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been banned"
      });

      setDuration("");
      setReason("");
      onBanComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Ban Duration</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1hour">1 Hour</SelectItem>
                <SelectItem value="1day">1 Day</SelectItem>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Reason</label>
            <Textarea
              placeholder="Explain why this user is being banned..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleBan}
            disabled={loading || !duration || !reason.trim()}
            className="w-full"
            variant="destructive"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Ban
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BanUserDialog;
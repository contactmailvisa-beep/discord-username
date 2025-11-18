import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportTicketDialog = ({ open, onOpenChange }: SupportTicketDialogProps) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please describe your issue",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          title: title.trim(),
          status: "pending"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your support ticket has been created"
      });

      setTitle("");
      onOpenChange(false);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Open Support Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe your issue
            </label>
            <Textarea
              placeholder="Please describe your problem in detail..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDialog;
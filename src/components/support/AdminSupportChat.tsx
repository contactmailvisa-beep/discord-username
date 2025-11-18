import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Loader2, Ban, CheckCircle, Mail, Calendar, Shield } from "lucide-react";
import BanUserDialog from "./BanUserDialog";

interface Message {
  id: string;
  message: string;
  created_at: string;
  is_support: boolean;
}

interface AdminSupportChatProps {
  ticket: any;
  onBack: () => void;
}

const AdminSupportChat = ({ ticket, onBack }: AdminSupportChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [userBanned, setUserBanned] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    checkUserBanStatus();

    const channel = supabase
      .channel(`admin-ticket-${ticket.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `ticket_id=eq.${ticket.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkUserBanStatus = async () => {
    const { data } = await supabase
      .from("user_bans")
      .select("*")
      .eq("user_id", ticket.user_id)
      .or(`is_permanent.eq.true,expires_at.gt.${new Date().toISOString()}`)
      .single();

    setUserBanned(!!data);
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .eq("ticket_id", ticket.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
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

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("support_messages")
        .insert({
          ticket_id: ticket.id,
          sender_id: user.id,
          message: newMessage.trim(),
          is_support: true
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const validStatuses = ['pending', 'urgent', 'emergency', 'status_7', 'scheduled', 'closed'];
      if (!validStatuses.includes(newStatus)) return;

      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus as any })
        .eq("id", ticket.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket status updated"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUnban = async () => {
    try {
      const { error } = await supabase
        .from("user_bans")
        .delete()
        .eq("user_id", ticket.user_id);

      if (error) throw error;

      setUserBanned(false);
      toast({
        title: "Success",
        description: "User unbanned successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loginMethod = ticket.profiles?.email?.includes("@") ? "Email" : "OAuth";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Support Ticket</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Chat Section */}
        <Card className="flex flex-col h-[600px]">
          <div className="p-4 border-b">
            <h3 className="font-semibold">{ticket.title}</h3>
            <Select defaultValue={ticket.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48 mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="urgent">مستعجل</SelectItem>
                <SelectItem value="emergency">طارئ</SelectItem>
                <SelectItem value="status_7">حالة 7</SelectItem>
                <SelectItem value="scheduled">مجدول</SelectItem>
                <SelectItem value="closed">مغلق</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.is_support ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[75%] ${
                      msg.is_support
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {!msg.is_support && (
                      <div className="text-xs font-semibold mb-1">
                        {ticket.profiles?.username}
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your response..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !sending && handleSend()}
                disabled={sending}
              />
              <Button onClick={handleSend} disabled={sending || !newMessage.trim()}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* User Info Section */}
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={ticket.profiles?.avatar_url} />
              <AvatarFallback>{ticket.profiles?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{ticket.profiles?.username}</h3>
              <Badge variant="outline" className="mt-2">
                {loginMethod}
              </Badge>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{ticket.profiles?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span className="font-medium">
                {new Date(ticket.profiles?.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Discord ID:</span>
              <span className="font-medium font-mono">{ticket.profiles?.discord_id}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            {userBanned ? (
              <Button
                onClick={handleUnban}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Remove Ban
              </Button>
            ) : (
              <Button
                onClick={() => setBanDialogOpen(true)}
                variant="destructive"
                className="w-full"
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban User
              </Button>
            )}
          </div>
        </Card>
      </div>

      <BanUserDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        userId={ticket.user_id}
        onBanComplete={() => {
          setUserBanned(true);
          setBanDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminSupportChat;
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, User, Calendar, Ban, Check } from "lucide-react";
import AdminSupportChat from "@/components/support/AdminSupportChat";

interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    email: string;
    avatar_url: string;
    created_at: string;
    discord_id: string;
  };
}

const SupportManagement = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSupportAccess();
    fetchTickets();

    const channel = supabase
      .channel('admin-tickets')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'support_tickets'
      }, () => {
        fetchTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkSupportAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("support_team")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!data) {
      toast({
        title: "Access Denied",
        description: "You don't have support team access",
        variant: "destructive"
      });
      window.location.href = "/dashboard";
    }
  };

  const fetchTickets = async () => {
    try {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (ticketsError) throw ticketsError;

      if (!ticketsData || ticketsData.length === 0) {
        setTickets([]);
        setLoading(false);
        return;
      }

      // Fetch profiles separately
      const userIds = ticketsData.map(t => t.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url, created_at, discord_id")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const combined = ticketsData.map(ticket => ({
        ...ticket,
        profiles: profilesData?.find(p => p.id === ticket.user_id) || {
          username: "Unknown",
          email: "unknown@example.com",
          avatar_url: "",
          created_at: new Date().toISOString(),
          discord_id: "N/A"
        }
      }));

      setTickets(combined as any);
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

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500",
    urgent: "bg-orange-500/10 text-orange-500",
    emergency: "bg-red-500/10 text-red-500",
    status_7: "bg-purple-500/10 text-purple-500",
    scheduled: "bg-blue-500/10 text-blue-500",
    closed: "bg-green-500/10 text-green-500"
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading support tickets...</div>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <AdminSupportChat
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
      />
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Support Management</h1>
        <p className="text-muted-foreground">Manage user support tickets and conversations</p>
      </div>

      <div className="grid gap-4">
        {tickets.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No support tickets found
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{ticket.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {ticket.profiles?.username || "Unknown User"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(ticket.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Badge className={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportManagement;
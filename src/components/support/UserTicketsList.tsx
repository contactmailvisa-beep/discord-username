import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, AlertTriangle, Zap, Calendar, CheckCircle } from "lucide-react";
import SupportChatWindow from "./SupportChatWindow";

interface Ticket {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

const statusConfig = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  urgent: { label: "مستعجل", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: AlertTriangle },
  emergency: { label: "طارئ", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: Zap },
  status_7: { label: "حالة 7", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: MessageSquare },
  scheduled: { label: "مجدول", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Calendar },
  closed: { label: "مغلق", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle }
};

const UserTicketsList = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
    
    // Subscribe to ticket updates
    const channel = supabase
      .channel('user-tickets')
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

  const fetchTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Loading your tickets...</div>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Support Tickets</h2>
        <div className="grid gap-4">
          {tickets.map((ticket) => {
            const config = statusConfig[ticket.status as keyof typeof statusConfig];
            const Icon = config.icon;
            
            return (
              <Card 
                key={ticket.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedTicket(ticket.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" />
                      <h3 className="font-semibold">{ticket.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={config.color}>
                    {config.label}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedTicket && (
        <SupportChatWindow
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
};

export default UserTicketsList;
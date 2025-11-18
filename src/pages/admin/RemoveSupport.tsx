import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserMinus, Loader2 } from "lucide-react";

interface SupportMember {
  id: string;
  user_id: string;
  added_at: string;
  profiles: {
    username: string;
    email: string;
    avatar_url: string;
  };
}

const RemoveSupport = () => {
  const [members, setMembers] = useState<SupportMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSupportMembers();
  }, []);

  const fetchSupportMembers = async () => {
    try {
      const { data: supportData, error: supportError } = await supabase
        .from("support_team")
        .select("*")
        .order("added_at", { ascending: false });

      if (supportError) throw supportError;

      if (!supportData || supportData.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      // Fetch profiles separately
      const userIds = supportData.map(s => s.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const combined = supportData.map(support => ({
        ...support,
        profiles: profilesData?.find(p => p.id === support.user_id) || {
          username: "Unknown",
          email: "unknown@example.com",
          avatar_url: ""
        }
      }));

      setMembers(combined as any);
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

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => {
      if (prev.includes(id)) {
        return prev.filter(m => m !== id);
      }
      return [...prev, id];
    });
  };

  const handleRemove = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one member",
        variant: "destructive"
      });
      return;
    }

    setRemoving(true);
    try {
      const { error } = await supabase
        .from("support_team")
        .delete()
        .in("id", selectedMembers);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Removed ${selectedMembers.length} member(s) from support team`
      });

      setSelectedMembers([]);
      fetchSupportMembers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading support team members...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Remove Support Team Members</h1>
        <p className="text-muted-foreground">Select and remove members from the support team</p>
      </div>

      <Card className="p-6 space-y-6">
        {members.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No support team members found
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {members.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <Card
                    key={member.id}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-destructive' : ''
                    }`}
                    onClick={() => toggleMember(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.profiles?.avatar_url} />
                        <AvatarFallback>
                          {member.profiles?.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{member.profiles?.username}</div>
                        <div className="text-sm text-muted-foreground">{member.profiles?.email}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Added: {new Date(member.added_at).toLocaleDateString()}
                        </div>
                      </div>
                      {isSelected && (
                        <Badge variant="destructive">Selected</Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {selectedMembers.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {selectedMembers.length} member(s) selected
                </div>
                <Button
                  onClick={handleRemove}
                  disabled={removing}
                  variant="destructive"
                  className="w-full"
                >
                  {removing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserMinus className="w-4 h-4 mr-2" />
                  )}
                  Remove from Support Team
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default RemoveSupport;
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Loader2, X } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}

const AddSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url")
        .or(`email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "No Results",
          description: "No users found with that email or username",
          variant: "default"
        });
      }
      
      setSearchResults(data || []);
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

  const toggleUser = (user: Profile) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      }
      return [...prev, user];
    });
  };

  const handleAdd = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one user",
        variant: "destructive"
      });
      return;
    }

    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const inserts = selectedUsers.map(u => ({
        user_id: u.id,
        added_by: user.id
      }));

      const { error } = await supabase
        .from("support_team")
        .insert(inserts);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added ${selectedUsers.length} user(s) to support team`
      });

      setSelectedUsers([]);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add Support Team Members</h1>
        <p className="text-muted-foreground">Search and add users to the support team</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search by email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Search Results</h3>
            <div className="grid gap-2">
              {searchResults.map((user) => {
                const isSelected = selectedUsers.find(u => u.id === user.id);
                return (
                  <Card
                    key={user.id}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      {isSelected && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {selectedUsers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Selected Users ({selectedUsers.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <Badge key={user.id} variant="secondary" className="pl-2 pr-1">
                  {user.username}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => toggleUser(user)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Button
              onClick={handleAdd}
              disabled={adding}
              className="w-full"
            >
              {adding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Add to Support Team
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AddSupport;
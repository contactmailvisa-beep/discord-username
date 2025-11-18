import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, User } from "lucide-react";

interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  banner: string | null;
  banner_color: string | null;
  accent_color: number | null;
  discriminator: string;
}

const LookUp = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<DiscordUser | null>(null);

  const getAvatarUrl = (userId: string, avatarHash: string | null) => {
    if (!avatarHash) return null;
    const extension = avatarHash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=512`;
  };

  const getBannerUrl = (userId: string, bannerHash: string | null) => {
    if (!bannerHash) return null;
    const extension = bannerHash.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.${extension}?size=1024`;
  };

  const handleLookup = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a Discord user ID");
      return;
    }

    setLoading(true);
    setUserData(null);

    try {
      const { data, error } = await supabase.functions.invoke('lookup', {
        body: { userId: userId.trim() }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setUserData(data);
      toast.success("User data loaded successfully!");
    } catch (error: any) {
      console.error('Lookup error:', error);
      toast.error(error.message || "Failed to lookup user");
    } finally {
      setLoading(false);
    }
  };

  const hexToRgb = (hex: number) => {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `${r}, ${g}, ${b}`;
  };

  const getAccentColor = () => {
    if (userData?.accent_color) {
      return hexToRgb(userData.accent_color);
    }
    return "88, 101, 242"; // Discord's default blurple
  };

  return (
    <div className="min-h-screen bg-[#1e1f22] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Lookup Discord IDs</h1>
          <p className="text-[#b5bac1]">
            Enter a Discord user ID to fetch profile details via our community-powered API
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-[#2b2d31] rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#b5bac1]">Discord ID</label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="000000000000000000"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="flex-1 bg-[#1e1f22] border-[#1e1f22] text-white placeholder:text-[#6d6f78] focus-visible:ring-[#5865f2]"
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              />
              <Button
                onClick={handleLookup}
                disabled={loading || !userId.trim()}
                className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 rounded-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Lookup
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        {userData && (
          <div 
            className="bg-[#2b2d31] rounded-xl overflow-hidden animate-fade-in"
            style={{
              boxShadow: `0 0 20px rgba(${getAccentColor()}, 0.3)`
            }}
          >
            {/* Banner */}
            <div 
              className="h-32 relative"
              style={{
                background: userData.banner 
                  ? `url(${getBannerUrl(userData.id, userData.banner)}) center/cover`
                  : userData.banner_color 
                    ? userData.banner_color
                    : `rgb(${getAccentColor()})`
              }}
            />

            {/* Profile Content */}
            <div className="p-6 pt-0">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4">
                <div 
                  className="w-24 h-24 rounded-full border-8 border-[#2b2d31] overflow-hidden"
                  style={{
                    boxShadow: `0 0 15px rgba(${getAccentColor()}, 0.5)`
                  }}
                >
                  {userData.avatar ? (
                    <img 
                      src={getAvatarUrl(userData.id, userData.avatar)} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ background: `rgb(${getAccentColor()})` }}
                    >
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {userData.global_name || userData.username}
                  </h2>
                  <p className="text-[#b5bac1]">
                    {userData.username}
                    {userData.discriminator !== "0" && `#${userData.discriminator}`}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="bg-[#1e1f22] rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#b5bac1] text-sm">User ID</span>
                    <span className="text-white font-mono text-sm">{userData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#b5bac1] text-sm">Username</span>
                    <span className="text-white text-sm">{userData.username}</span>
                  </div>
                  {userData.global_name && (
                    <div className="flex justify-between">
                      <span className="text-[#b5bac1] text-sm">Display Name</span>
                      <span className="text-white text-sm">{userData.global_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Section */}
        <div className="bg-[#404249] rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Support this service</h3>
              <p className="text-[#b5bac1] text-sm">
                We also need bot token donations to keep the lookup service running smoothly.
              </p>
            </div>
            <Button className="bg-white hover:bg-gray-100 text-[#2b2d31] rounded-md whitespace-nowrap">
              Support us
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#6d6f78] text-sm">
          Not affiliated with Discord, Inc.
        </div>
      </div>
    </div>
  );
};

export default LookUp;

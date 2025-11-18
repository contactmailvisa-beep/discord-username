import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, User, Calendar, Hash, AtSign, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  banner: string | null;
  banner_color: string | null;
  accent_color: number | null;
  discriminator: string;
  public_flags: number;
}

const LookUp = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<DiscordUser | null>(null);
  const [isVisible, setIsVisible] = useState(true);

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
      toast.error("الرجاء إدخال معرف مستخدم Discord");
      return;
    }

    // إذا كان هناك بيانات موجودة، أخفِها أولاً
    if (userData) {
      setIsVisible(false);
      await new Promise(resolve => setTimeout(resolve, 300)); // انتظر fade out
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
      setIsVisible(true); // أظهر البيانات الجديدة
      toast.success("تم تحميل بيانات المستخدم بنجاح!");
    } catch (error: any) {
      console.error('Lookup error:', error);
      toast.error(error.message || "فشل في البحث عن المستخدم");
      setIsVisible(true);
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
    return "88, 101, 242";
  };

  const getCreationDate = (id: string) => {
    const timestamp = Number(BigInt(id) >> BigInt(22)) + 1420070400000;
    return new Date(timestamp).toLocaleDateString('ar-SA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center p-4 md:p-8 relative">
      <div className="w-full max-w-4xl space-y-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 transition-all duration-500 hover:scale-110 hover:rotate-6 hover:bg-primary/20">
            <Search className="w-8 h-8 text-primary transition-transform duration-300" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-[fade-in_0.6s_ease-out]">
            البحث عن حسابات Discord
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-[fade-in_0.8s_ease-out]">
            أدخل معرف مستخدم Discord للحصول على تفاصيل الملف الشخصي الكاملة
          </p>
        </div>

        {/* Search Card */}
        <Card className="p-8 bg-card/50 backdrop-blur-xl border-2 border-primary/20 shadow-2xl shadow-primary/10 transition-all duration-500 hover:shadow-3xl hover:shadow-primary/20 hover:border-primary/30 animate-[fade-in_1s_ease-out]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2 transition-all duration-300 hover:gap-3">
                <Hash className="w-4 h-4 text-primary transition-transform duration-300 hover:scale-125" />
                معرف المستخدم
              </label>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="000000000000000000"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="flex-1 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 text-lg focus:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
                <Button
                  onClick={handleLookup}
                  disabled={loading || !userId.trim()}
                  size="lg"
                  className="px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      جاري البحث...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                      <Search className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                      بحث
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* User Profile Card */}
        {userData && (
          <Card 
            className="overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02]"
            style={{
              borderColor: `rgba(${getAccentColor()}, 0.3)`,
              boxShadow: `0 0 40px rgba(${getAccentColor()}, 0.2), 0 0 80px rgba(${getAccentColor()}, 0.1)`,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {/* Banner */}
            <div 
              className="h-48 relative bg-gradient-to-br from-primary/20 to-primary/5"
              style={{
                background: userData.banner 
                  ? `url(${getBannerUrl(userData.id, userData.banner)}) center/cover`
                  : userData.banner_color 
                    ? userData.banner_color
                    : `linear-gradient(135deg, rgb(${getAccentColor()}) 0%, rgba(${getAccentColor()}, 0.7) 100%)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>

            {/* Profile Content */}
            <div className="p-8 pt-0 -mt-16 relative">
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <div 
                  className="w-32 h-32 rounded-3xl border-4 border-card overflow-hidden bg-card transition-all duration-300 hover:scale-110 hover:rotate-3 cursor-pointer"
                  style={{
                    boxShadow: `0 0 30px rgba(${getAccentColor()}, 0.6), 0 0 60px rgba(${getAccentColor()}, 0.3)`
                  }}
                >
                  {userData.avatar ? (
                    <img 
                      src={getAvatarUrl(userData.id, userData.avatar)} 
                      alt="Avatar"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, rgb(${getAccentColor()}) 0%, rgba(${getAccentColor()}, 0.8) 100%)` }}
                    >
                      <User className="w-16 h-16 text-white transition-transform duration-300 hover:scale-125" />
                    </div>
                  )}
                </div>
                {userData.public_flags > 0 && (
                  <div 
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-2 border-card transition-all duration-300 hover:scale-110"
                    style={{ 
                      background: `rgb(${getAccentColor()})`
                    }}
                  >
                    <Shield className="w-5 h-5 text-white transition-transform duration-300 hover:rotate-12" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold text-foreground transition-all duration-300 hover:scale-105 inline-block">
                    {userData.global_name || userData.username}
                  </h2>
                  <div className="flex items-center gap-2 text-xl text-muted-foreground transition-all duration-300 hover:gap-3">
                    <AtSign className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                    {userData.username}
                    {userData.discriminator !== "0" && `#${userData.discriminator}`}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-5 bg-background/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20">
                        <Hash className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-125" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1 transition-colors duration-300 group-hover:text-foreground">معرف المستخدم</p>
                        <p className="text-sm font-mono text-foreground break-all transition-all duration-300 group-hover:text-primary">{userData.id}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5 bg-background/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20">
                        <AtSign className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-125" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1 transition-colors duration-300 group-hover:text-foreground">اسم المستخدم</p>
                        <p className="text-sm font-semibold text-foreground break-all transition-all duration-300 group-hover:text-primary">{userData.username}</p>
                      </div>
                    </div>
                  </Card>

                  {userData.global_name && (
                    <Card className="p-5 bg-background/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20">
                          <User className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-125" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-muted-foreground mb-1 transition-colors duration-300 group-hover:text-foreground">الاسم المعروض</p>
                          <p className="text-sm font-semibold text-foreground break-all transition-all duration-300 group-hover:text-primary">{userData.global_name}</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Card className="p-5 bg-background/50 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20">
                        <Calendar className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-125" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1 transition-colors duration-300 group-hover:text-foreground">تاريخ الإنشاء</p>
                        <p className="text-sm font-semibold text-foreground transition-all duration-300 group-hover:text-primary">{getCreationDate(userData.id)}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm animate-[fade-in_1.2s_ease-out] transition-all duration-300 hover:text-foreground hover:scale-105">
          غير مرتبط بشركة Discord, Inc.
        </div>
      </div>
    </div>
  );
};

export default LookUp;

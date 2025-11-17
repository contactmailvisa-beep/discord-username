import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, 
  Key, 
  Crown, 
  Settings, 
  LogOut, 
  User, 
  ChevronRight,
  Sparkles,
  History,
  TrendingUp,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  path: string;
  badge?: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);

  useEffect(() => {
    loadUserData();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        } else if (session) {
          loadUserData();
        }
      }
    );

    return () => authSubscription.unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        navigate("/auth");
        return;
      }

      setUser(authUser);

      // Check if user is email user (has password)
      const providers = authUser.app_metadata?.providers || [];
      setIsEmailUser(providers.includes('email') || authUser.app_metadata?.provider === 'email');

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profileData) {
        navigate("/select-username");
        return;
      }

      setProfile(profileData);

      // Load subscription
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      setSubscription(subData);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate("/auth");
  };

  const navItems: NavItemProps[] = [
    { icon: <Home className="h-5 w-5" />, label: "الصفحة الرئيسية", path: "/dashboard" },
    { icon: <Key className="h-5 w-5" />, label: "التوكنات", path: "/dashboard/tokens" },
    { icon: <Sparkles className="h-5 w-5" />, label: "توليد يوزرات", path: "/dashboard/generator" },
    { icon: <History className="h-5 w-5" />, label: "سجل الفحوصات", path: "/dashboard/history" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "الإحصائيات", path: "/dashboard/stats" },
    { 
      icon: <Crown className="h-5 w-5" />, 
      label: "البريميوم", 
      path: "/dashboard/premium",
      badge: subscription?.plan_type === "premium" ? "نشط" : "ترقية"
    },
    ...(isEmailUser ? [{ icon: <Settings className="h-5 w-5" />, label: "الإعدادات", path: "/dashboard/settings" }] : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      {/* Profile Section */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => {
            navigate("/dashboard/profile");
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-background-accent transition-all duration-200 ease-out group"
        >
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right">
            <p className="font-semibold text-foreground group-hover:text-primary transition-smooth">
              {profile?.username || "User"}
            </p>
            <p className="text-xs text-text-muted">
              {subscription?.plan_type === "premium" ? "بريميوم" : "مجاني"}
            </p>
          </div>
          <User className="h-4 w-4 text-text-muted group-hover:text-primary transition-smooth" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              navigate(item.path);
              setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-out",
              "hover:bg-background-accent group",
              location.pathname === item.path && "bg-background-accent"
            )}
          >
            <div className={cn(
              "transition-all duration-200 ease-out",
              location.pathname === item.path ? "text-primary" : "text-text-muted group-hover:text-foreground"
            )}>
              {item.icon}
            </div>
            <span className={cn(
              "flex-1 text-right font-medium transition-all duration-200 ease-out",
              location.pathname === item.path ? "text-foreground" : "text-text-muted group-hover:text-foreground"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <span className={cn(
                "px-2 py-0.5 text-xs font-semibold rounded-full",
                subscription?.plan_type === "premium"
                  ? "bg-success/20 text-success"
                  : "bg-primary/20 text-primary"
              )}>
                {item.badge}
              </span>
            )}
            {location.pathname === item.path && (
              <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-14 bg-background-secondary border-b border-border z-50 flex items-center px-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-0 bg-background-secondary">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {profile?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground">{profile?.username || "User"}</span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-background-secondary border-l border-border flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14">
        <div className="container max-w-7xl mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

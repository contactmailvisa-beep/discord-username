import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, SearchX, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div
        className={`relative z-10 max-w-2xl w-full text-center transform transition-all duration-1000 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* 404 Number with animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          </div>
          <h1 className="text-[180px] md:text-[240px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60 leading-none relative animate-float">
            404
          </h1>
        </div>

        {/* Icon with rotation animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-background/80 backdrop-blur-sm p-6 rounded-full border-2 border-primary/20 animate-bounce-slow">
              <SearchX className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            عذراً، الصفحة غير موجودة
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو ربما لم تكن موجودة من الأساس
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="gap-2 group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            <Home className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">العودة للرئيسية</span>
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="gap-2 group hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95 border-2"
          >
            <ArrowRight className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>الرجوع للخلف</span>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="px-4">DUC - Discord Username Checker</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;

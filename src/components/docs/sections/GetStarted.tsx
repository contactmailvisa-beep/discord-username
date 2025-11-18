import { Rocket, UserPlus, Key, Shield, Zap, CheckCircle, ArrowRight, Code, Database, Settings, BookOpen, Globe, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import CodeBlock from "../CodeBlock";

const GetStarted = () => {
  const steps = [
    {
      number: 1,
      icon: <UserPlus className="w-6 h-6" />,
      title: "إنشاء حساب جديد",
      description: "ابدأ رحلتك بإنشاء حساب على المنصة",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      details: [
        "انتقل إلى صفحة التسجيل على الموقع",
        "اختر طريقة التسجيل (البريد الإلكتروني، Google، أو Discord)",
        "أدخل بياناتك الأساسية",
        "تحقق من بريدك الإلكتروني إذا اخترت التسجيل بالبريد",
        "اختر اسم مستخدم فريد لحسابك (3-12 حرف)"
      ]
    },
    {
      number: 2,
      icon: <Key className="w-6 h-6" />,
      title: "إضافة Discord Token",
      description: "أضف Discord token الخاص بك للبدء بفحص الأسماء",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      details: [
        "افتح Discord في المتصفح",
        "اضغط F12 لفتح Developer Tools",
        "انتقل إلى تبويب Network",
        "أرسل أي رسالة في Discord",
        "ابحث عن أي طلب وانسخ الـ Authorization token من Headers",
        "عد إلى لوحة التحكم واضغط على 'Add Token'",
        "الصق الـ token وأعطه اسماً مميزاً"
      ]
    },
    {
      number: 3,
      icon: <Shield className="w-6 h-6" />,
      title: "توليد API Key",
      description: "أنشئ مفتاح API للوصول البرمجي",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      details: [
        "انتقل إلى قسم Profile في لوحة التحكم",
        "ابحث عن قسم API Keys Management",
        "اضغط على زر 'Generate New Key'",
        "اختر اسماً واضحاً لمفتاح API",
        "انسخ المفتاح فوراً (لن يظهر مرة أخرى)",
        "احفظ المفتاح في مكان آمن"
      ]
    },
    {
      number: 4,
      icon: <Zap className="w-6 h-6" />,
      title: "بدء الفحص",
      description: "ابدأ بفحص توفر أسماء Discord",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      details: [
        "اختر الطريقة المناسبة لك:",
        "• Generator: لتوليد أسماء عشوائية وفحصها",
        "• Manual Check: لفحص اسم محدد تختاره",
        "• Global Account: استخدام الحساب المشترك (مرة كل 12 ساعة)",
        "• API: فحص برمجي من تطبيقك الخاص"
      ]
    }
  ];

  const usageMethods = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "الاستخدام من الموقع",
      description: "استخدم واجهة الموقع البسيطة",
      steps: [
        "سجل دخولك إلى لوحة التحكم",
        "اختر طريقة الفحص (Generator أو Manual Check)",
        "أدخل الأسماء التي تريد فحصها",
        "انتظر النتائج (تظهر خلال ثوانٍ)",
        "احفظ الأسماء المتاحة في Saved Usernames"
      ]
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "الاستخدام البرمجي (API)",
      description: "ادمج الخدمة في تطبيقك",
      steps: [
        "احصل على API Key من Profile",
        "أضف Discord token في قسم Tokens",
        "استخدم الـ endpoint المناسب",
        "أرسل الأسماء المراد فحصها",
        "عالج النتائج في تطبيقك"
      ]
    }
  ];

  const plans = [
    {
      name: "Free Plan",
      icon: <Shield className="w-5 h-5" />,
      price: "مجاني",
      features: [
        "50 طلب API يومياً",
        "فحص 10 أسماء في الطلب الواحد",
        "وصول للـ Generator و Manual Check",
        "استخدام Global Account مرة كل 12 ساعة",
        "دعم أساسي"
      ],
      color: "border-blue-500/20 bg-blue-500/5"
    },
    {
      name: "Premium Plan",
      icon: <Zap className="w-5 h-5" />,
      price: "$3/شهر",
      features: [
        "100 طلب API يومياً",
        "فحص 10 أسماء في الطلب الواحد",
        "جميع مميزات الخطة المجانية",
        "إحصائيات متقدمة",
        "دعم ذو أولوية",
        "وصول أسرع للخدمة"
      ],
      color: "border-primary/20 bg-primary/5",
      badge: "الأكثر شعبية"
    }
  ];

  const quickExample = `// مثال بسيط: فحص اسم مستخدم واحد
const apiKey = 'your-api-key-here';
const tokenName = 'MyToken';
const username = 'example';

fetch('https://discord-username.lovable.app/functions/v1/check-api-username', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify({
    token_name: tokenName,
    usernames: [username]
  })
})
.then(response => response.json())
.then(data => {
  console.log('النتيجة:', data.results[0]);
  // { username: "example", available: true }
})
.catch(error => console.error('خطأ:', error));`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Rocket className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-text-link bg-clip-text text-transparent">
            ابدأ الآن - دليل شامل للمبتدئين
          </h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          دليل مفصل خطوة بخطوة لاستخدام منصة Discord Username Checker من البداية حتى الاحتراف. 
          مصمم خصيصاً للمبتدئين بشرح واضح ومبسط.
        </p>
      </div>

      {/* Welcome Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <BookOpen className="h-5 w-5 text-primary" />
        <AlertDescription className="text-muted-foreground">
          <strong className="text-foreground">مرحباً بك!</strong> هذا الدليل مصمم ليكون سهل الفهم للجميع. 
          سنشرح كل شيء بالتفصيل مع أمثلة عملية. لا تقلق إذا كنت مبتدئاً - سنأخذك خطوة بخطوة.
        </AlertDescription>
      </Alert>

      {/* What is this platform */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          ما هي هذه المنصة؟
        </h2>
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            <strong className="text-foreground">Discord Username Checker (DUC)</strong> هي منصة متخصصة تساعدك على:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">فحص توفر أسماء Discord</p>
                <p className="text-xs">تحقق من توفر أي اسم مستخدم على Discord بشكل فوري</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">توليد أسماء عشوائية</p>
                <p className="text-xs">أنشئ أسماء مستخدمين فريدة وافحصها تلقائياً</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">الوصول البرمجي (API)</p>
                <p className="text-xs">ادمج الخدمة في تطبيقك أو بوتك الخاص</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">حفظ الأسماء المفضلة</p>
                <p className="text-xs">احفظ وأدر الأسماء المتاحة التي تعجبك</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Step by Step Guide */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          الخطوات الأساسية للبدء
        </h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-4">
                {/* Step Header */}
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.bgColor} ${step.color} flex items-center justify-center font-bold text-xl`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${step.bgColor} ${step.color}`}>
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Step Details */}
                <div className="ml-16 space-y-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Usage Methods */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-primary" />
          طرق الاستخدام
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usageMethods.map((method, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {method.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick API Example */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          مثال سريع - أول طلب API
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          إليك مثال بسيط يوضح كيفية فحص اسم مستخدم واحد باستخدام JavaScript:
        </p>
        <CodeBlock code={quickExample} language="javascript" />
      </Card>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          الخطط المتاحة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-6 border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${plan.color}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-2xl font-bold text-primary">{plan.price}</p>
                    </div>
                  </div>
                  {plan.badge && (
                    <Badge className="bg-primary text-primary-foreground">{plan.badge}</Badge>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-5 w-5 text-primary" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">ملاحظات هامة:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>احفظ API Key في مكان آمن - لا يمكن استرجاعه بعد إنشائه</li>
              <li>Discord tokens حساسة - لا تشاركها مع أحد</li>
              <li>احترم حدود Rate Limiting لتجنب حظر API</li>
              <li>استخدم الحساب المشترك (Global Account) للتجربة قبل إضافة token</li>
              <li>راجع قسم Error Handling لفهم رسائل الأخطاء</li>
              <li>في حالة وجود مشاكل، تحقق من Support للحصول على المساعدة</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Next Steps */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-text-link/10 border-primary/20">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          الخطوات التالية
        </h2>
        <div className="space-y-3 text-muted-foreground text-sm">
          <p>الآن بعد أن فهمت الأساسيات، يمكنك:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all text-left group">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                <span className="font-semibold text-foreground">استكشف API Endpoints</span>
              </div>
              <p className="text-xs mt-1">تعرف على جميع نقاط النهاية المتاحة</p>
            </button>
            <button className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all text-left group">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                <span className="font-semibold text-foreground">شاهد أمثلة الأكواد</span>
              </div>
              <p className="text-xs mt-1">تطبيق عملي بلغات برمجة مختلفة</p>
            </button>
            <button className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all text-left group">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                <span className="font-semibold text-foreground">افهم Rate Limits</span>
              </div>
              <p className="text-xs mt-1">تجنب الأخطاء وحسّن استخدامك</p>
            </button>
            <button className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all text-left group">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                <span className="font-semibold text-foreground">اقرأ Best Practices</span>
              </div>
              <p className="text-xs mt-1">نصائح لاستخدام احترافي</p>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GetStarted;

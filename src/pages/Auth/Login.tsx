import React, { useState, useEffect } from 'react';
import {
  Building2,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  Quote,
  Eye,
  EyeOff,
  Truck,
  Award,
  Layers,
  Clock,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuoteItem {
  id: number;
  quote: string;
  hindiQuote?: string;
  author: string;
  role: string;
  tag: string;
  stat?: { label: string; value: string };
}

const QUOTES_LIST: QuoteItem[] = [
  {
    id: 1,
    quote:
      "मजबूत नींव, भरोसे का निर्माण — पटना एवं संपूर्ण बिहार के हर प्रोजेक्ट में अटूट गुणवत्ता और समय पर आपूर्ति का संकल्प।",
    hindiQuote: "विश्वास और मजबूती का एक ही नाम — किशोर कंस्ट्रक्शन",
    author: "Kishor Keshri",
    role: "Founder & Managing Director",
    tag: "OUR FOUNDATION",
    stat: { label: "Total Deliveries", value: "15,000+ Projects" },
  },
  {
    id: 2,
    quote:
      "Quality in building materials is never an accident; it is always the result of uncompromising standards, accurate weight measurement, and pure certified stock.",
    hindiQuote: "शुद्धता और सही नाप-तौल ही हमारी सबसे बड़ी पहचान है।",
    author: "Kishor Construction Quality Lab",
    role: "Material Testing & Grade Assurance",
    tag: "QUALITY PROMISE",
    stat: { label: "Material Purity", value: "100% BIS Certified" },
  },
  {
    id: 3,
    quote:
      "From Grade-1 UltraTech/Ambuja Cement to Fe550D High-Ductility TMT Steel, we supply materials that stand the test of generations.",
    hindiQuote: "हर बोरी सीमेंट और हर टन सरिया में पीढ़ियों का भरोसा।",
    author: "Kishor Construction Logistics",
    role: "State-wide Dispatch Network",
    tag: "PREMIUM SUPPLY",
    stat: { label: "Fleet Capacity", value: "24/7 Yard Dispatch" },
  },
  {
    id: 4,
    quote:
      "Technology-driven ERP management empowers us to deliver real-time transparency, instant billing, and zero-delay logistics to all our contractors and builders.",
    hindiQuote: "पारदर्शी व्यापार, सुरक्षित वित्तीय प्रबंधन एवं त्वरित सेवा।",
    author: "Kishor Keshri",
    role: "Proprietor",
    tag: "DIGITAL EXCELLENCE",
    stat: { label: "ERP Operations", value: "100% Automated" },
  },
  {
    id: 5,
    quote:
      "हर ईंट, हर बोरी सीमेंट, और हर टन स्टील में सिर्फ और सिर्फ ईमानदारी और विश्वास। बिहार के नवनिर्माण में हमारा अटूट योगदान।",
    hindiQuote: "विश्वसनीयता ही हमारी सबसे बड़ी पूंजी है।",
    author: "Kishor Keshri",
    role: "Proprietor & Director",
    tag: "CORE VALUE",
    stat: { label: "Customer Trust", value: "Since 2012" },
  },
];

export const Login: React.FC = () => {
  const { switchRole } = useApp();

  const [email, setEmail] = useState('kishor@kishorconstruction.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Automatic quote rotation every 10 seconds strictly without manual intervention
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % QUOTES_LIST.length);
        setIsFading(false);
      }, 400);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole('OWNER');
  };

  const activeQuote = QUOTES_LIST[currentQuoteIndex];

  return (
    <div className="w-full h-screen min-h-screen bg-charcoal-950 flex font-sans overflow-hidden select-none">
      
      {/* ========================================================= */}
      {/* LEFT HALF: FULL HEIGHT OWNER LOGIN FORM (5/12 cols)       */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[42%] xl:w-[38%] h-full bg-white flex flex-col justify-between p-6 sm:p-10 xl:p-14 overflow-y-auto z-20 shadow-2xl relative">
        
        {/* Top Branding */}
        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-charcoal-950 text-yellow-brand flex items-center justify-center shadow-lg border border-yellow-500/20 flex-shrink-0">
              <Building2 className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Private Owner Portal
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-charcoal-950 tracking-tight leading-tight mt-0.5">
                KISHOR CONSTRUCTION
              </h1>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-950 tracking-tight">
              Owner Sign In
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1.5 leading-relaxed">
              Enter your verified owner credentials to access full enterprise ERP, profit & loss, inventory, and logistics.
            </p>
          </div>

          {/* Owner Profile Card */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-orange-50/60 rounded-2xl border border-amber-200 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-charcoal-950 text-yellow-brand flex items-center justify-center font-black text-sm shadow-md border border-yellow-500/30 flex-shrink-0">
              KK
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-charcoal-950 truncate">Kishor Keshri</p>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Owner Superuser
                </span>
              </div>
              <p className="text-[11px] text-charcoal-600 truncate mt-0.5 font-medium">
                Proprietor & Managing Director • Full Access
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Owner Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm font-semibold rounded-xl border border-concrete-300 pl-10 pr-4 py-3 text-charcoal-900 bg-concrete-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-brand/30 focus:border-charcoal-950 transition-all shadow-xs"
                  placeholder="kishor@kishorconstruction.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-charcoal-700">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('OTP reset code sent to Kishor Keshri’s registered WhatsApp & Email.')}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-900 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm font-semibold rounded-xl border border-concrete-300 pl-10 pr-11 py-3 text-charcoal-900 bg-concrete-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-brand/30 focus:border-charcoal-950 transition-all shadow-xs"
                  placeholder="Enter security password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-charcoal-400 hover:text-charcoal-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-charcoal-700 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-concrete-300 text-yellow-brand focus:ring-yellow-brand accent-amber-500 cursor-pointer"
                />
                <span>Remember this authorized terminal</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:to-yellow-600 text-charcoal-950 font-black text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] cursor-pointer mt-2"
            >
              <span>Unlock Owner Dashboard</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-6 border-t border-concrete-200 mt-6 flex items-center justify-between text-[11px] text-charcoal-500">
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <Shield className="w-4 h-4 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span className="font-semibold text-charcoal-400">© 2026 Kishor Construction</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT HALF: FULL HEIGHT 10s DYNAMIC AMBIENT QUOTES        */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-1 h-full bg-gradient-to-br from-charcoal-950 via-[#0B111D] to-[#121A29] p-10 xl:p-16 2xl:p-20 text-white flex-col justify-between relative overflow-hidden">
        
        {/* Background Ambient Glows & Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-10 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-charcoal-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-charcoal-700/80">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-concrete-200">
              Live Brand Vision & Standards
            </span>
          </div>

          <div className="flex items-center gap-2 bg-charcoal-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-charcoal-700/80">
            <Clock className="w-4 h-4 text-yellow-brand" />
            <span className="text-xs font-mono font-extrabold text-amber-400">
              Auto-Cycling Every 10s
            </span>
          </div>
        </div>

        {/* Center Quote Display (Automatic Animation) */}
        <div className="relative z-10 my-auto py-10 max-w-4xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-yellow-brand text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-brand" />
            {activeQuote.tag}
          </div>

          {/* Quote Body with Smooth Fade Transition */}
          <div
            className={`transition-all duration-500 ease-out min-h-[260px] flex flex-col justify-center ${
              isFading ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            <Quote className="w-14 h-14 text-amber-500/30 mb-4" />

            <blockquote className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-white leading-relaxed tracking-tight">
              "{activeQuote.quote}"
            </blockquote>

            {activeQuote.hindiQuote && (
              <p className="text-sm xl:text-base font-semibold text-amber-300 mt-5 italic">
                — {activeQuote.hindiQuote}
              </p>
            )}

            {/* Author Attribution & Stat Box */}
            <div className="mt-8 pt-6 border-t border-charcoal-800/90 flex items-center justify-between">
              <div>
                <h4 className="text-base xl:text-lg font-black text-white">{activeQuote.author}</h4>
                <p className="text-xs xl:text-sm text-concrete-400 font-medium mt-0.5">
                  {activeQuote.role}
                </p>
              </div>

              {activeQuote.stat && (
                <div className="bg-charcoal-900/90 backdrop-blur-md border border-charcoal-700/80 px-5 py-2.5 rounded-2xl text-right shadow-lg">
                  <p className="text-[10px] text-concrete-400 uppercase font-bold tracking-wider">
                    {activeQuote.stat.label}
                  </p>
                  <p className="text-sm xl:text-base font-black text-yellow-brand mt-0.5">
                    {activeQuote.stat.value}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Key Pillars */}
        <div className="relative z-10">
          {/* 3 Value Pillars */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-concrete-300 font-bold border-t border-charcoal-800/80 pt-5">
            <span className="flex items-center justify-center gap-2 py-2 bg-charcoal-900/50 rounded-xl border border-charcoal-800/60">
              <Award className="w-4 h-4 text-amber-500" /> UltraTech & Ambuja Certified
            </span>
            <span className="flex items-center justify-center gap-2 py-2 bg-charcoal-900/50 rounded-xl border border-charcoal-800/60">
              <Truck className="w-4 h-4 text-amber-500" /> Real-time GPS Fleet Tracking
            </span>
            <span className="flex items-center justify-center gap-2 py-2 bg-charcoal-900/50 rounded-xl border border-charcoal-800/60">
              <Layers className="w-4 h-4 text-amber-500" /> Patna & Bihar Wide Logistics
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

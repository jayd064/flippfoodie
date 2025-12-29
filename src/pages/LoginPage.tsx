import { Sparkles, Phone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-32">
      {/* Logo & Welcome */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Welcome to Flip</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to save your scans and get personalized insights
        </p>
      </div>

      {/* Auth Buttons */}
      <div className="space-y-4 animate-fade-up animation-delay-100">
        {/* Google Sign In */}
        <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-300">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-semibold text-foreground">Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Phone Number */}
        <button className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground shadow-glow-primary hover:opacity-90 active:scale-[0.98] transition-all duration-200">
          <Phone className="w-5 h-5" />
          <span className="font-semibold">Continue with Phone</span>
        </button>
      </div>

      {/* Phone Input Preview (shows what comes next) */}
      <div className="mt-8 animate-fade-up animation-delay-200">
        <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Or enter your phone number
          </label>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-border">
              <span className="text-lg">🇮🇳</span>
              <span className="text-sm font-medium text-foreground">+91</span>
            </div>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 px-4 py-3 bg-card rounded-xl border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors">
            Send OTP
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Skip */}
      <div className="mt-auto pt-8 text-center animate-fade-up animation-delay-300">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip for now
        </Link>
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground mt-6 animate-fade-up animation-delay-300">
        By continuing, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
};

export default LoginPage;

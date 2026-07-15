import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Building2, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  useEffect(() => setMounted(true), []);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (token) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-neutral-50">
      {/* Animated mesh gradient background */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[200px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-6">
        {/* Frosted glass card */}
        <div className={`w-full max-w-md transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'}`}>
          <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.05)] p-8">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 rounded-b-full bg-gradient-to-r from-indigo-500 to-purple-500" />

            {/* Logo */}
            <div className={`mb-8 text-center transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="mt-5 text-2xl font-bold text-neutral-950 tracking-tight">DeskSpace</h1>
              <p className="mt-1 text-sm text-neutral-500">Admin Dashboard</p>
            </div>

            {/* Header */}
            <div className={`mb-8 text-center transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-lg font-semibold text-neutral-950">Sign in to your account</h2>
              <p className="mt-1.5 text-sm text-neutral-500">Use your admin credentials to access the dashboard.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className={`space-y-1.5 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label htmlFor="email" className="block text-[13px] font-medium text-neutral-700">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="admin@deskspace.in"
                    className={`
                      w-full h-11 pl-4 pr-10 rounded-lg border bg-white/60 text-sm text-neutral-950 placeholder-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200
                      ${focused === 'email' 
                        ? 'border-indigo-500 bg-white shadow-[0_0_0_3px_rgb(99_102_241_/_0.15)]' 
                        : 'border-neutral-200 hover:border-neutral-300'
                      }
                    `}
                    autoFocus
                  />
                  <Mail className={`
                    absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200
                    ${focused === 'email' ? 'text-indigo-500' : 'text-neutral-300'}
                  `} />
                </div>
              </div>

              <div className={`space-y-1.5 transition-all duration-500 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <label htmlFor="password" className="block text-[13px] font-medium text-neutral-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter your password"
                    className={`
                      w-full h-11 pl-4 pr-10 rounded-lg border bg-white/60 text-sm text-neutral-950 placeholder-neutral-400
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200
                      ${focused === 'password' 
                        ? 'border-indigo-500 bg-white shadow-[0_0_0_3px_rgb(99_102_241_/_0.15)]' 
                        : 'border-neutral-200 hover:border-neutral-300'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`flex items-center gap-2.5 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full h-11 rounded-lg text-sm font-semibold text-white
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:from-indigo-500 hover:to-purple-500
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center justify-center gap-2
                  shadow-[0_4px_14px_rgb(99_102_241_/_0.3)]
                  hover:shadow-[0_6px_20px_rgb(99_102_241_/_0.4)]
                  active:scale-[0.98]
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: mounted ? '500ms' : '0ms' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className={`text-center text-[11px] text-neutral-400 mt-8 transition-all duration-500 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Protected admin area &middot; Contact support for access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
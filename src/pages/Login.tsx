import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import Spline from '@splinetool/react-spline';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          navigate("/dashboard");
        }
      } else {
        // const { data, error } = await supabase.auth.signUp({
        //   email,
        //   password,
        // });

        // if (error) throw error;

        // if (data.user) {
        // const { error: profileError } = await supabase
        //   .from('user_profiles')
        //   .insert([
        //     {
        //       id: data.user.id,
        //       full_name: fullName,
        //       organization: organization,
        //       role: 'investigator'
        //     }
        //   ]);

        // if (profileError) throw profileError;
        //   const { error: profileError } = await supabase
        //     .from("user_profiles")
        //     .update({
        //       full_name: fullName,
        //       organization: organization,
        //     })
        //     .eq("id", data.user.id);

        //   if (profileError) throw profileError;
        //   navigate("/dashboard");
        // }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName,
              organization,
            },
          },
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("user_profiles")
            .insert([
              {
                id: data.user.id,
                fullName,
                organization,
              },
            ]);
          if (profileError) console.error(profileError);
          alert("Sign-up successful! Please check your email to confirm your account.");
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0f2c] to-black flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-30">
        <Spline scene="https://prod.spline.design/u3UcBgbjs2EVwGYB/scene.splinecode" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#0a0f2c]/80 backdrop-blur-sm border border-blue-500/20 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-blue-400" />
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {isLogin
              ? "Sign in to access your cases"
              : "Join Evedentia platform"}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#0a0f2c] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0a0f2c] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Law Enforcement Agency"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0f2c] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-[#0a0f2c] border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/20">
            <p className="text-gray-500 text-xs text-center">
              For forensic and investigative use only. All data is encrypted and
              secured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, Mic, MicOff, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../utils';
import { supabase } from '../lib/supabase';
import { VoiceInput } from '../components/VoiceInput';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (text: string) => {
    // Simple email detection in the transcript
    const emailMatch = text.match(/\S+@\S+\.\S+/);
    if (emailMatch) {
      setEmail(emailMatch[0]);
    }
  };

  const helpItems = [
    { title: "Voice Input", description: "Click the microphone icon to use voice commands for entering your email." },
    { title: "Password Visibility", description: "Toggle password visibility using the eye icon." },
    { title: "Remember Me", description: "Stay signed in on this device for faster access." }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 bg-black/40" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="backdrop-blur-xl bg-black/20 rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-200 mt-2"
            >
              Sign in to continue your spiritual journey
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVoiceInput(!showVoiceInput)}
                  className="text-gray-300 hover:text-white"
                >
                  {showVoiceInput ? <MicOff size={16} /> : <Mic size={16} />}
                </motion.button>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#646cff] focus:ring-1 focus:ring-[#646cff] transition-colors"
                  required
                />
              </div>
              <AnimatePresence>
                {showVoiceInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <VoiceInput onTranscript={handleVoiceInput} darkMode={true} language="English" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#646cff] focus:ring-1 focus:ring-[#646cff] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#646cff] focus:ring-[#646cff]"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="text-gray-300 hover:text-white"
              >
                <HelpCircle size={20} />
              </button>
            </div>

            <AnimatePresence>
              {isHelpOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/10 rounded-lg p-4 space-y-3"
                >
                  {helpItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <h3 className="text-sm font-medium text-white">{item.title}</h3>
                      <p className="text-xs text-gray-300">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full py-2.5 rounded-lg font-medium transition-all duration-200",
                "flex items-center justify-center gap-2",
                "bg-[#646cff] hover:bg-[#747bff]",
                "text-white shadow-lg shadow-[#646cff]/25",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <LogIn size={20} />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-[#646cff] hover:text-[#747bff] transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogIn, UserPlus, Github, Chrome, RefreshCw } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../lib/supabase';
import { cn } from '../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const user = await signInWithEmail(email, password);
        if (user?.email) onSuccess(user.email);
      } else {
        const user = await signUpWithEmail(email, password);
        if (user?.email) {
          setError("验证邮件已发送，请查收后再登录。");
        }
      }
    } catch (err: any) {
      setError(err.message || "身份验证失败，请检查您的凭据。");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Google redirect will happen, no need to handle success here
    } catch (err: any) {
      setError(err.message || "Google 登录失败。");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={cn(
              "relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl p-8",
              "bg-slate-900 border-slate-800"
            )}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-8 pr-12">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? '欢迎回来' : '开启您的 Matrix'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin 
                  ? '登录以同步您的核心资产与时间矩阵。' 
                  : '注册以获得永久的云端同步特权。'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium leading-relaxed animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
                {isLogin ? '立即登录' : '创建账号'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest px-4">
                  <span className="bg-slate-900 px-2 text-slate-500 font-bold">Or continue with</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl transition-all hover:bg-slate-100 flex items-center justify-center gap-3"
              >
                <Chrome size={20} className="text-red-500" />
                使用 Google 账号登录
              </button>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-400 text-sm hover:text-blue-400 transition-colors"
              >
                {isLogin ? '还没有账号？ 立即加入' : '已有账号？ 返回登录'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
              <p className="text-[10px] text-slate-600 uppercase font-mono tracking-tighter">
                Matrix Protocol Secure Auth Gateway v2.0
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

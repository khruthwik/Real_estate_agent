import React, { useState } from 'react';
import { Home, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function UltimateRealEstateRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // simulate network request
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Registered');
    setLoading(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">
      {/* Background Ken Burns */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1740&q=80"
          alt="Beautiful home exterior"
          className="object-cover w-full h-full animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="max-w-md w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 space-y-6 shadow-xl">
          
          {/* Logo & Heading */}
          <div className="text-center mb-4">
            <Home className="mx-auto w-12 h-12 text-white mb-2" />
            <h1 className="text-3xl font-extrabold text-white mb-1">EstateVista</h1>
            <p className="text-sm text-white/80">Create your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <input
                id="name"
                type="text"
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/50 py-3 pl-10 pr-4 text-white placeholder-transparent focus:outline-none focus:border-white transition"
                aria-label="Full name"
              />
              <label
                htmlFor="name"
                className="
                  absolute left-10 text-white/70 transition-all
                  top-0 text-xs
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:text-xs
                "
              >
                Full Name
              </label>
              <User className="absolute left-0 top-3 w-6 h-6 text-white/70" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/50 py-3 pl-10 pr-4 text-white placeholder-transparent focus:outline-none focus:border-white transition"
                aria-label="Email address"
              />
              <label
                htmlFor="email"
                className="
                  absolute left-10 text-white/70 transition-all
                  top-0 text-xs
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:text-xs
                "
              >
                Email Address
              </label>
              <Mail className="absolute left-0 top-3 w-6 h-6 text-white/70" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/50 py-3 pl-10 pr-12 text-white placeholder-transparent focus:outline-none focus:border-white transition"
                aria-label="Password"
              />
              <label
                htmlFor="password"
                className="
                  absolute left-10 text-white/70 transition-all
                  top-0 text-xs
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:text-xs
                "
              >
                Password
              </label>
              <Lock className="absolute left-0 top-3 w-6 h-6 text-white/70" />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/50 py-3 pl-10 pr-12 text-white placeholder-transparent focus:outline-none focus:border-white transition"
                aria-label="Confirm password"
              />
              <label
                htmlFor="confirm"
                className="
                  absolute left-10 text-white/70 transition-all
                  top-0 text-xs
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:text-xs
                "
              >
                Confirm Password
              </label>
              <Lock className="absolute left-0 top-3 w-6 h-6 text-white/70" />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-xl text-lg font-semibold text-white
                bg-gradient-to-r from-teal-400 to-indigo-500 shadow-lg transform transition
                hover:scale-105 hover:shadow-2xl active:scale-95
                ${loading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between text-sm text-white/80">
            <a href="#" className="hover:underline">Already have an account?</a>
            <a href="#" className="hover:underline">Sign In</a>
          </div>
        </div>
      </div>

      {/* Ken Burns Keyframes */}
      <style jsx>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.1) translate(-5%, -5%); }
        }
        .animate-kenburns {
          animation: kenburns 20s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}

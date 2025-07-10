import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';

export default function UltimateRealEstateLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Login successful!");
    setTimeout(() => {
        window.location.href = '/chatpage';
      }, 1000);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative h-screen w-full overflow-hidden font-sans">
      {/* Background Ken Burns */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1740&q=80"
          alt="Luxury home exterior"
          className="object-cover w-full h-full animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
      </div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="max-w-md w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 space-y-8 shadow-xl">

          {/* Logo & Heading */}
          <div className="text-center">
            <Home className="mx-auto w-12 h-12 text-white mb-2" />
            <h1 className="text-3xl font-extrabold text-white mb-1">EstateVista</h1>
            <p className="text-sm text-white/80">Your portal to premium properties</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70"
                aria-label={showPassword ? 'Show password' : 'Hide password'}
              >
                {showPassword ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
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
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between text-sm text-white/80">
            <a href="#" className="hover:underline">Forgot password?</a>
            <a href="#" className="hover:underline">Create account</a>
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

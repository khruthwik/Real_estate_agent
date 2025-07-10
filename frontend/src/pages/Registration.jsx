import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Home, Phone, User } from 'lucide-react';

export default function UltimateRealEstateLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, phone, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });

      console.log("Response:", res);

      alert("Registration successful! Please log in.");
      
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
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
            <p className="text-sm text-white/80">Create your premium account</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
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
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
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

            {/* Phone */}
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/50 py-3 pl-10 pr-4 text-white placeholder-transparent focus:outline-none focus:border-white transition"
                aria-label="Phone number"
              />
              <label
                htmlFor="phone"
                className="
                  absolute left-10 text-white/70 transition-all
                  top-0 text-xs
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:text-xs
                "
              >
                Phone Number
              </label>
              <Phone className="absolute left-0 top-3 w-6 h-6 text-white/70" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/50 py-3 pl-10 pr-12 text-white placeholder-transparent focus:outline-none focus:border-white transition"
                aria-label="Confirm password"
              />
              <label
                htmlFor="confirmPassword"
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
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/70"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`
                w-full py-3 rounded-xl text-lg font-semibold text-white
                bg-gradient-to-r from-teal-400 to-indigo-500 shadow-lg transform transition
                hover:scale-105 hover:shadow-2xl active:scale-95
                ${loading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          {/* Footer Links */}
          <div className="flex justify-between text-sm text-white/80">
            <a href="#" className="hover:underline">Need help?</a>
            <a href="#" className="hover:underline">Already have an account?</a>
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
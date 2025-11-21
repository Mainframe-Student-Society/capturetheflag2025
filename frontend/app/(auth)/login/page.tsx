"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { motion } from "motion/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Login successful");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2">
          <LogIn className="w-8 h-8" />
          Welcome Back
        </h1>
        <p className="text-gray-400 text-lg">Sign in to your account</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="username" className="text-white text-lg mb-2 block">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="bg-gray-700 border-gray-600 text-white h-12 text-lg"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="relative">
          <Label htmlFor="password" className="text-white text-lg mb-2 block">
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="bg-gray-700 border-gray-600 text-white h-12 text-lg pr-12"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-12 text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.form>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p className="text-gray-400 text-lg">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Create account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

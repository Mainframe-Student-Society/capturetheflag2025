"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_student: false,
    is_wlv_student: false,
    student_id: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await authApi.register(formData);

    if (result.success) {
      console.log("Registration successful", result.data);
    } else {
      console.error("Registration failed:", result.error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2">
          <UserPlus className="w-8 h-8" />
          Create Account
        </h1>
        <p className="text-gray-400 text-lg">Join the CTF competition</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white text-lg mb-2 block">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-gray-700 border-gray-600 text-white h-12 text-lg"
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

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="is_student"
              checked={formData.is_student}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_student: !!checked })
              }
            />
            <Label htmlFor="is_student" className="text-white text-lg">
              I am a student
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="is_wlv_student"
              checked={formData.is_wlv_student}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_wlv_student: !!checked })
              }
            />
            <Label htmlFor="is_wlv_student" className="text-white text-lg">
              I am a University of Wolverhampton student
            </Label>
          </div>
        </div>

        {(formData.is_student || formData.is_wlv_student) && (
          <div>
            <Label
              htmlFor="student_id"
              className="text-white text-lg mb-2 block"
            >
              Student ID
            </Label>
            <Input
              id="student_id"
              type="text"
              value={formData.student_id}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              className="bg-gray-700 border-gray-600 text-white h-12 text-lg"
              placeholder="Enter your student ID"
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-lg">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

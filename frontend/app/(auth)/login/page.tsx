"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth-api";
import { loginFormSchema, type LoginFormData } from "@/lib/schemas";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Use the authApi directly instead of api.auth
      const result = await authApi.login(values);

      if (result.success && result.data) {
        // Store authentication data in localStorage - this is already handled in authApi.login
        // but keeping it here as backup
        if (result.data.token && typeof window !== "undefined") {
          localStorage.setItem("authToken", result.data.token);
        }
        if (result.data.user && typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(result.data.user));
        }

        router.push("/challenges");
      } else {
        // Handle specific error cases based on the server response
        if (result.status === 401) {
          setError(
            "Invalid username or password. Please check your credentials and try again."
          );
        } else if (result.status === 404) {
          setError("Login endpoint not found. Please contact support.");
        } else if (result.status === 500) {
          setError("Server error. Please try again later or contact support.");
        } else if (
          result.error?.includes("Failed to fetch") ||
          result.error?.includes("fetch")
        ) {
          setError(
            "Unable to connect to the server. Please check if the backend is running and try again."
          );
        } else if (result.error?.includes("timeout")) {
          setError(
            "Request timeout. Please check your connection and try again."
          );
        } else if (result.error?.includes("CORS")) {
          setError(
            "Connection blocked by security policy. Please contact support."
          );
        } else {
          setError(result.error || "Login failed. Please try again later.");
        }
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Cannot connect to server. Please ensure the backend is running and try again."
        );
      } else if (error instanceof Error && error.name === "AbortError") {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else {
        setError(
          `An unexpected error occurred: ${
            error instanceof Error ? error.message : "Please try again."
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3 mb-2">
          <LogIn className="w-8 h-8 text-primary" />
          Sign In
        </h1>
        <p className="text-muted-foreground text-lg">Welcome back to the CTF</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-lg">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-muted border-border text-foreground h-12 text-lg"
                    placeholder="Enter your username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-lg">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="bg-muted border-border text-foreground h-12 text-lg pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground h-12 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground text-lg">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

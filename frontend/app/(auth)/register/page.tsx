"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { registerFormSchema, type RegisterFormData } from "@/lib/schemas";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      retypePassword: "",
      is_student: false,
      is_wlv_student: false,
      student_id: "",
    },
    mode: "onChange",
  });

  const isStudentChecked = form.watch("is_student") ?? false;
  const isWlvStudentChecked = form.watch("is_wlv_student") ?? false;

  const onSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    setError(null);

    const result = await api.auth.register({
      username: values.username,
      email: values.email,
      password: values.password,
      is_student: values.is_student ?? false,
      is_wlv_student: values.is_wlv_student ?? false,
      student_id: values.student_id || "",
    });

    if (result.success) {
      console.log("Registration successful", result.data);
      // You can redirect here or show success message
    } else {
      console.error("Registration failed:", result.error);

      // Handle specific error types
      if (result.error?.includes("UNIQUE constraint failed: users.email")) {
        setError(
          "An account with this email already exists. Please use a different email or try logging in."
        );
      } else if (
        result.error?.includes("UNIQUE constraint failed: users.username")
      ) {
        setError(
          "This username is already taken. Please choose a different username."
        );
      } else {
        setError("Registration failed. Please try again later.");
      }
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-muted-foreground text-lg">
          Join the mainframe technology competition
        </p>
      </motion.div>

      <Card className=" ">
        <CardContent className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <motion.div
                  className="bg-destructive/10 border-2 border-destructive/50 text-destructive px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring" }}
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-base">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-muted/50 border-2 border-border focus:border-primary text-foreground h-12 text-base transition-all duration-200 hover:border-muted-foreground/50"
                        placeholder="Enter your username"
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-base">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="bg-muted/50 border-2 border-border focus:border-primary text-foreground h-12 text-base transition-all duration-200 hover:border-muted-foreground/50"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="bg-muted/50 border-2 border-border focus:border-primary text-foreground h-12 text-base pr-12 transition-all duration-200 hover:border-muted-foreground/50"
                          placeholder="Enter your password"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="retypePassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-base">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showRetypePassword ? "text" : "password"}
                          className="bg-muted/50 border-2 border-border focus:border-primary text-foreground h-12 text-base pr-12 transition-all duration-200 hover:border-muted-foreground/50"
                          placeholder="Confirm your password"
                        />
                        <motion.button
                          type="button"
                          onClick={() =>
                            setShowRetypePassword(!showRetypePassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showRetypePassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="is_student"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-foreground text-base font-normal cursor-pointer">
                        I am a student
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_wlv_student"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-foreground text-base font-normal cursor-pointer">
                        I am a University of Wolverhampton student
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              {isStudentChecked && isWlvStudentChecked && (
                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold text-base">
                        Student ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-muted/50 border-2 border-border focus:border-primary text-foreground h-12 text-base transition-all duration-200 hover:border-muted-foreground/50"
                          placeholder="Enter your student ID"
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              )}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-muted-foreground text-lg">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-semibold transition-colors underline decoration-2 underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

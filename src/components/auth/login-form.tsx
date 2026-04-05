"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Lock, User, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loginAction } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { setTokens } from "@/lib/api-client";

const loginSchema = z.object({
  identifier: z.string().min(3, "Username or email must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginAction({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.success && result.user) {
        // Store tokens for client-side API calls
        setTokens(result.user.accessToken, result.user.refreshToken);
        
        // Success: Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Database level error (User Not Found, Wrong Password, etc)
        setError(result.message || "Authentication failed.");
      }
    } catch (err: any) {
      console.error("DEBUG: Login Action Error:", err);
      // provide more details if available
      const detail = err && typeof err === 'object' && 'message' in err ? `: ${err.message}` : '';
      setError(`The authentication service is temporarily unavailable${detail}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Sign In
        </h1>
        <p className="text-zinc-400 text-sm">
          Enter your credentials to access the ALMS portal.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-in shake duration-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Identifier Field */}
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-zinc-300">
              Username or Email
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
              <Input
                id="identifier"
                placeholder="Enter your username or email"
                className={cn(
                  "pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all h-12",
                  errors.identifier && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
                )}
                {...register("identifier")}
                disabled={isLoading}
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-red-400 font-medium">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <button
                type="button"
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-teal-400 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "pl-10 pr-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all h-12",
                  errors.password && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10"
                )}
                {...register("password")}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            className="border-zinc-700 bg-zinc-900 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
            onCheckedChange={(checked) => {
              // Note: react-hook-form doesn't automatically handle custom components' onCheckedChange unless using Controller
              // but for this mock we can just use the register or a small hack.
            }}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-medium text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Secure session preservation
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-teal-600/20 active:scale-[0.98] transition-all disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            "Access Portal"
          )}
        </Button>

        {/* Secondary Navigation */}
        <div className="text-center md:text-left space-y-4 pt-4 border-t border-zinc-800/50">
            <p className="text-xs text-zinc-500 font-sans">
                By signing in, you agree to our <a href="#" className="text-zinc-400 hover:underline">Terms of Service</a> and <a href="#" className="text-zinc-400 hover:underline">Privacy Policy</a>.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
               <button type="button" className="text-xs text-zinc-400 hover:text-white transition-colors">System Status</button>
               <div className="w-1 h-1 rounded-full bg-zinc-800" />
               <button type="button" className="text-xs text-zinc-400 hover:text-white transition-colors">Support Center</button>
            </div>
        </div>
      </form>
    </div>
  );
};

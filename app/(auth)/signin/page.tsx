"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Github, Shield, Zap, Globe } from "lucide-react"
import { signInWithGoogle, signInWithGithub } from "@/app/actions/auth"

export default function SignInPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = e
        const { innerWidth, innerHeight } = window
        const xPercent = (clientX / innerWidth) * 100
        const yPercent = (clientY / innerHeight) * 100

        containerRef.current.style.setProperty("--mouse-x", `${xPercent}%`)
        containerRef.current.style.setProperty("--mouse-y", `${yPercent}%`)
      }
    }

    const handleScroll = () => {
      const cards = document.querySelectorAll(".auth-card, .trust-indicator")
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          card.classList.add("animate-in")
        }
      })
    }

    document.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log("Sign in:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 dark:opacity-30 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-transparent to-transparent transition-all duration-300"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="auth-card bg-card/80 backdrop-blur-sm border-border shadow-lg hover:border-emerald-600/50 dark:hover:border-emerald-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-full mx-auto mb-4 group-hover:bg-emerald-200/50 dark:group-hover:bg-emerald-800/50 transition-all duration-300">
              <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your archiGenie account to continue designing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Sign In */}
            <div className="space-y-3">
              <form action={signInWithGoogle}>
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-muted hover:border-emerald-600/50 dark:hover:border-emerald-400/50 transition-all duration-300 group hover:scale-105"
                  type="submit"
                >
                  <Mail className="w-4 h-4 mr-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  Continue with Google
                </Button>
              </form>
              <form action={signInWithGithub}>
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-muted hover:border-emerald-600/50 dark:hover:border-emerald-400/50 transition-all duration-300 group hover:scale-105"
                  type="submit"
                >
                  <Github className="w-4 h-4 mr-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  Continue with GitHub
                </Button>
              </form>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-emerald-600/20 dark:focus:ring-emerald-400/20 transition-all duration-300 hover:border-emerald-600/50 dark:hover:border-emerald-400/50"
                  placeholder="Enter your email"
                />
              </div>

              <div className="group">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                >
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pr-10 focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-emerald-600/20 dark:focus:ring-emerald-400/20 transition-all duration-300 hover:border-emerald-600/50 dark:hover:border-emerald-400/50"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center group">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-border rounded transition-colors"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="ml-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Sign In
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="trust-indicator mt-8 text-center transition-all duration-700 ease-out">
          <p className="text-xs text-muted-foreground mb-2">Trusted by 10,000+ architects worldwide</p>
          <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Shield className="w-3 h-3" />
              <span>Enterprise Security</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Zap className="w-3 h-3" />
              <span>99.9% Uptime</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              <Globe className="w-3 h-3" />
              <span>Global CDN</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-card.animate-in,
        .trust-indicator.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

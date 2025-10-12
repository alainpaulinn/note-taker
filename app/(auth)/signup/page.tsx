"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Github, Check, Star, Users, Zap } from "lucide-react"
import { signInWithGoogle, signInWithGithub } from "@/app/actions/auth"

const benefits = [
  "14-day free trial, no credit card required",
  "Access to all AI-powered design tools",
  "Unlimited projects and exports",
  "Priority customer support",
]

export default function SignUpPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    company: "",
    agreeToTerms: false,
    subscribeToUpdates: true,
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
      const cards = document.querySelectorAll(".signup-card, .benefit-item, .testimonial-card")
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
    // Handle sign up logic here
    console.log("Sign up:", formData)
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
          className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent transition-all duration-300"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Benefits */}
          <div className="hidden lg:flex flex-col justify-center space-y-6">
            <div className="signup-card transition-all duration-700 ease-out">
              <div className="inline-flex items-center space-x-2 bg-blue-100/50 dark:bg-blue-900/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Join Thousands</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Start designing with AI in minutes</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of architects who are already transforming their workflow with archiGenie.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="benefit-item flex items-center space-x-3 transition-all duration-700 ease-out group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <div className="testimonial-card bg-muted/50 backdrop-blur-sm rounded-lg p-4 border border-border hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-all duration-500 group">
              <div className="flex items-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic group-hover:text-foreground transition-colors">
                "archiGenie has revolutionized our design process. What used to take weeks now takes hours."
              </p>
              <p className="text-sm font-medium text-foreground mt-2">— Sarah Chen, Principal Architect</p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <Card className="signup-card bg-card/80 backdrop-blur-sm border-border shadow-lg hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100/50 dark:bg-blue-900/30 rounded-full mx-auto mb-4 group-hover:bg-blue-200/50 dark:group-hover:bg-blue-800/50 transition-all duration-300">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Create Your Account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Start your free trial today. No credit card required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Sign Up */}
              <div className="space-y-3">
                <form action={signInWithGoogle}>
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-muted hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-all duration-300 group hover:scale-105"
                    type="submit"
                  >
                    <Mail className="w-4 h-4 mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    Continue with Google
                  </Button>
                </form>
                <form action={signInWithGithub}>
                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-muted hover:border-blue-600/50 dark:hover:border-blue-400/50 transition-all duration-300 group hover:scale-105"
                    type="submit"
                  >
                    <Github className="w-4 h-4 mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
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

              {/* Email Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:border-blue-600/50 dark:hover:border-blue-400/50"
                      placeholder="John"
                    />
                  </div>
                  <div className="group">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:border-blue-600/50 dark:hover:border-blue-400/50"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="group">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
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
                    className="mt-1 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:border-blue-600/50 dark:hover:border-blue-400/50"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="group">
                  <Label
                    htmlFor="company"
                    className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    Company (Optional)
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:border-blue-600/50 dark:hover:border-blue-400/50"
                    placeholder="Your Architecture Firm"
                  />
                </div>

                <div className="group">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
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
                      className="pr-10 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-600/20 dark:focus:ring-blue-400/20 transition-all duration-300 hover:border-blue-600/50 dark:hover:border-blue-400/50"
                      placeholder="Create a strong password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 group">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                      className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500"
                    />
                    <Label
                      htmlFor="agreeToTerms"
                      className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 group">
                    <Checkbox
                      id="subscribeToUpdates"
                      checked={formData.subscribeToUpdates}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, subscribeToUpdates: checked as boolean })
                      }
                      className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500"
                    />
                    <Label
                      htmlFor="subscribeToUpdates"
                      className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      Send me product updates and architectural insights
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!formData.agreeToTerms}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Start Free Trial
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="testimonial-card mt-8 text-center transition-all duration-700 ease-out">
          <div className="flex justify-center items-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Users className="w-3 h-3" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Zap className="w-3 h-3" />
              <span>50,000+ Projects</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Star className="w-3 h-3" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-card.animate-in,
        .benefit-item.animate-in,
        .testimonial-card.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}

'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, Brain, Heart, Sparkles, Zap, Shield, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import PremiumHeader from '@/components/premium-header'

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/classify')
  }

  const features = [
    {
      icon: Brain,
      title: 'Emotion AI',
      description: 'Real-time facial emotion analysis powered by advanced vision technology',
      color: 'from-primary',
    },
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Comprehensive mood journaling with AI-powered insights and trends',
      color: 'from-accent',
    },
    {
      icon: Sparkles,
      title: 'IKS Wellness',
      description: 'Ancient Indian knowledge systems integrated with modern science',
      color: 'from-wellness-calm',
    },
    {
      icon: Zap,
      title: 'Quick Remedies',
      description: 'Instant wellness practices tailored to your emotional state',
      color: 'from-wellness-energy',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />

      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fadeInUp">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <p className="text-sm font-semibold text-primary">Wellness Reimagined</p>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Mind Deserves <span className="text-gradient">Exceptional</span> Care
              </h1>
              <p className="text-xl text-foreground/70 leading-relaxed">
                Experience personalized mental wellness blending cutting-edge AI with timeless Indian wisdom. Your journey to better mental health starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/classify')}
                size="lg"
                className="btn-primary h-auto py-4 px-8 text-lg rounded-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => router.push('/emotion-analysis')}
                size="lg"
                variant="outline"
                className="h-auto py-4 px-8 text-lg rounded-xl border-border/50"
              >
                Try Emotion AI
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/60">End-to-end encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/60">Privacy first</span>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="animate-slideInRight">
            <Card className="card-premium border-border/40 overflow-hidden shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/30 pb-6">
                <CardTitle className="text-2xl">Begin Your Wellness Journey</CardTitle>
                <p className="text-sm text-foreground/60 mt-2">Quick setup to personalize your experience</p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      What should we call you?
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-lg border-border/50 bg-background/50 h-12 text-base focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-foreground font-semibold">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="rounded-lg border-border/50 bg-background/50 h-12 text-base focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-foreground font-semibold">
                      Gender
                    </Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="rounded-lg border-border/50 bg-background/50 h-12 text-base focus:ring-2 focus:ring-primary/50">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="btn-primary w-full h-12 text-base font-semibold rounded-lg"
                  >
                    Begin Your Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                  <p className="text-xs text-foreground/50 text-center">
                    Your wellness journey is entirely private and secure. We never share your data.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Comprehensive Wellness Platform</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Everything you need for mental health and emotional well-being in one beautiful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="card-premium border-border/30 overflow-hidden hover:border-primary/40 transition-colors">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Wellness?</h2>
            <p className="text-xl text-foreground/70">
              Join thousands of people taking control of their mental health with science-backed AI and ancient wisdom.
            </p>
          </div>
          <Button
            onClick={() => router.push('/classify')}
            size="lg"
            className="btn-primary h-auto py-4 px-10 text-lg rounded-xl"
          >
            Start Free Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary transition">Emotion AI</a></li>
                <li><a href="#" className="hover:text-primary transition">Mood Tracker</a></li>
                <li><a href="#" className="hover:text-primary transition">Wellness Hub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-primary transition">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary transition">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8">
            <p className="text-center text-sm text-foreground/50">
              © 2026 MindWell. All rights reserved. Made with care for your mental health.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

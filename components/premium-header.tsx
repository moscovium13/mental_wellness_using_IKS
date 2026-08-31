'use client'

import { Button } from '@/components/ui/button'
import { Heart, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PremiumHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Analyze', href: '/emotion-analysis' },
    { label: 'Mood Tracking', href: '/classify' },
    { label: 'Wellness', href: '/short-term' },
  ]

  return (
    <>
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold text-gradient hidden sm:block">MindWell</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  variant="ghost"
                  className="text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  {link.label}
                </Button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="hidden sm:block rounded-lg border-border/50 hover:bg-primary/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Get Started
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/40 space-y-2 animate-fadeInUp">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href)
                    setMobileMenuOpen(false)
                  }}
                  variant="ghost"
                  className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10"
                >
                  {link.label}
                </Button>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}

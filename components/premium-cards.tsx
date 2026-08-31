'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface PremiumCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children?: ReactNode
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'calm' | 'energy'
  onClick?: () => void
  interactive?: boolean
}

const accentColors = {
  primary: 'from-primary/20 to-primary/10',
  secondary: 'from-secondary/20 to-secondary/10',
  accent: 'from-accent/20 to-accent/10',
  success: 'from-wellness-success/20 to-wellness-success/10',
  calm: 'from-wellness-calm/20 to-wellness-calm/10',
  energy: 'from-wellness-energy/20 to-wellness-energy/10',
}

const iconColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-wellness-success',
  calm: 'text-wellness-calm',
  energy: 'text-wellness-energy',
}

export function PremiumCard({
  title,
  description,
  icon: Icon,
  children,
  accent = 'primary',
  onClick,
  interactive = false,
}: PremiumCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`card-premium border-border/40 overflow-hidden transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:border-primary/40 hover:shadow-xl hover:-translate-y-1' : ''
      }`}
    >
      {Icon && (
        <CardHeader className={`bg-gradient-to-br ${accentColors[accent]} border-b border-border/30`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${accentColors[accent]} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${iconColors[accent]}`} />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              {description && <p className="text-sm text-foreground/60 mt-1">{description}</p>}
            </div>
          </div>
        </CardHeader>
      )}
      {!Icon && (
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description && <p className="text-foreground/60 mt-2">{description}</p>}
        </CardHeader>
      )}
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'calm' | 'energy'
}

export function StatCard({ label, value, unit, trend, trendValue, accent = 'primary' }: StatCardProps) {
  return (
    <Card className="card-premium border-border/40">
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-foreground/60 font-medium">{label}</p>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-lg text-foreground/60">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-foreground/60'}`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ProgressCardProps {
  title: string
  progress: number
  description?: string
  accent?: 'primary' | 'secondary' | 'accent' | 'success' | 'calm' | 'energy'
}

export function ProgressCard({ title, progress, description, accent = 'primary' }: ProgressCardProps) {
  return (
    <Card className="card-premium border-border/40">
      <CardContent className="p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && <p className="text-xs text-foreground/60 mt-1">{description}</p>}
        </div>
        <div className="space-y-2">
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${accentColors[accent].replace('from-', 'from-').replace('to-', 'to-')} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm font-semibold text-right text-foreground/70">{progress}%</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick?: () => void
}

export function FeatureCard({ title, description, icon: Icon, onClick }: FeatureCardProps) {
  return (
    <Card
      onClick={onClick}
      className="card-premium border-border/30 cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      <CardContent className="p-8 space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-foreground/60 text-sm leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Heart, Brain, Zap, Calendar, Award } from 'lucide-react'

interface WellnessData {
  date: string
  mood: number
  energy: number
  stress: number
  sleep: number
}

interface WellnessScore {
  category: string
  score: number
  target: number
  icon: React.ReactNode
}

const mockWellnessData: WellnessData[] = [
  { date: 'Mon', mood: 7, energy: 6, stress: 3, sleep: 7 },
  { date: 'Tue', mood: 6, energy: 5, stress: 4, sleep: 6 },
  { date: 'Wed', mood: 8, energy: 7, stress: 2, sleep: 8 },
  { date: 'Thu', mood: 7, energy: 6, stress: 3, sleep: 7 },
  { date: 'Fri', mood: 9, energy: 8, stress: 1, sleep: 8 },
  { date: 'Sat', mood: 8, energy: 7, stress: 2, sleep: 9 },
  { date: 'Sun', mood: 7, energy: 6, stress: 3, sleep: 8 },
]

const wellnessScores: WellnessScore[] = [
  { category: 'Mental Health', score: 78, target: 100, icon: <Brain className="w-5 h-5" /> },
  { category: 'Physical Health', score: 82, target: 100, icon: <Heart className="w-5 h-5" /> },
  { category: 'Energy Levels', score: 70, target: 100, icon: <Zap className="w-5 h-5" /> },
  { category: 'Sleep Quality', score: 85, target: 100, icon: <Calendar className="w-5 h-5" /> },
]

const dailyActivities = [
  { name: 'Meditation', value: 25, color: '#3b82f6' },
  { name: 'Yoga', value: 20, color: '#8b5cf6' },
  { name: 'Breathing', value: 15, color: '#ec4899' },
  { name: 'Walking', value: 20, color: '#10b981' },
  { name: 'Other', value: 20, color: '#6366f1' },
]

export default function WellnessDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')

  const overallScore = Math.round(wellnessScores.reduce((sum, score) => sum + score.score, 0) / wellnessScores.length)

  return (
    <div className="space-y-8">
      {/* Overall Wellness Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Score */}
        <Card className="card-premium">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Overall Wellness Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-gradient mb-2">{overallScore}</div>
              <p className="text-foreground/70">out of 100</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Status: Excellent</p>
              <p className="text-sm text-foreground/70">
                You're maintaining a healthy wellness routine. Keep up the great practices!
              </p>
            </div>

            <div className="pt-4 border-t border-border/30">
              <p className="text-sm font-semibold text-foreground mb-3">Weekly Trend</p>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+12% improvement this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card className="card-premium">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
            <CardTitle>Wellness Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={dailyActivities} cx="50%" cy="50%" labelLine={false} label={{ position: 'insideBottomRight', offset: -5 }} outerRadius={80} fill="#8884d8" dataKey="value">
                  {dailyActivities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dailyActivities.map((activity) => (
                <div key={activity.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activity.color }} />
                  <span className="text-sm text-foreground">{activity.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellness Metrics */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <CardTitle>Wellness Metrics Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wellnessScores.map((score) => (
              <div key={score.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-primary">{score.icon}</div>
                    <span className="font-semibold text-foreground">{score.category}</span>
                  </div>
                  <span className="text-lg font-bold text-gradient">{score.score}%</span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    style={{ width: `${score.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Wellness Trends</CardTitle>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-primary text-white'
                      : 'bg-muted text-foreground/70 hover:bg-border'
                  }`}
                >
                  {range === 'week' ? '1W' : range === 'month' ? '1M' : '1Y'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mockWellnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--foreground)" opacity={0.7} />
              <YAxis stroke="var(--foreground)" opacity={0.7} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent)', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--primary)', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="var(--wellness-calm)"
                strokeWidth={2}
                dot={{ fill: 'var(--wellness-calm)', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <CardTitle>Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="font-semibold text-green-900 mb-1">Trend: Improving Mood</p>
            <p className="text-sm text-green-800">Your mood has improved by 15% over the past week. Keep practicing meditation.</p>
          </div>

          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="font-semibold text-yellow-900 mb-1">Area of Focus: Stress Management</p>
            <p className="text-sm text-yellow-800">Consider adding pranayama exercises to your daily routine for better stress control.</p>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1">Recommendation: Sleep Quality</p>
            <p className="text-sm text-blue-800">Try the deep sleep meditation before bedtime to improve your sleep quality even further.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

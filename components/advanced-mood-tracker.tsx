'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { PremiumCard, ProgressCard, StatCard } from './premium-cards'
import { Smile, Frown, Meh, Heart, TrendingUp, Calendar, MessageSquare } from 'lucide-react'

const moodOptions = [
  { emoji: '😄', label: 'Excellent', color: 'from-green-400 to-emerald-500', value: 5 },
  { emoji: '😊', label: 'Good', color: 'from-blue-400 to-cyan-500', value: 4 },
  { emoji: '😐', label: 'Neutral', color: 'from-yellow-400 to-amber-500', value: 3 },
  { emoji: '😔', label: 'Bad', color: 'from-orange-400 to-red-500', value: 2 },
  { emoji: '😢', label: 'Terrible', color: 'from-red-500 to-pink-600', value: 1 },
]

const activities = [
  { name: 'Exercise', icon: '🏃', selected: false },
  { name: 'Sleep', icon: '😴', selected: false },
  { name: 'Work', icon: '💼', selected: false },
  { name: 'Social', icon: '👥', selected: false },
  { name: 'Meditation', icon: '🧘', selected: false },
  { name: 'Reading', icon: '📚', selected: false },
]

export default function AdvancedMoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<boolean[]>(new Array(activities.length).fill(false))
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleActivityToggle = (index: number) => {
    const updated = [...selectedActivities]
    updated[index] = !updated[index]
    setSelectedActivities(updated)
  }

  const handleSubmit = () => {
    if (selectedMood !== null) {
      setSubmitted(true)
      setTimeout(() => {
        setSelectedMood(null)
        setSelectedActivities(new Array(activities.length).fill(false))
        setNotes('')
        setSubmitted(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Main Tracker */}
      <Card className="card-premium border-border/40 overflow-hidden shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            How Are You Feeling?
          </CardTitle>
          <p className="text-sm text-foreground/60 mt-2">Track your emotional wellness in real-time</p>
        </CardHeader>
        <CardContent className="p-8">
          {!submitted ? (
            <div className="space-y-8">
              {/* Mood Selector */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">Your Current Mood</p>
                <div className="grid grid-cols-5 gap-3">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`group relative p-4 rounded-xl transition-all duration-300 ${
                        selectedMood === mood.value
                          ? `bg-gradient-to-br ${mood.color} shadow-lg scale-110`
                          : 'bg-background border-2 border-border/40 hover:border-primary/40 hover:shadow-md'
                      }`}
                    >
                      <div className="text-4xl mb-2">{mood.emoji}</div>
                      <p
                        className={`text-xs font-semibold transition-colors ${
                          selectedMood === mood.value ? 'text-white' : 'text-foreground/70'
                        }`}
                      >
                        {mood.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">What Influenced This?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activities.map((activity, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActivityToggle(idx)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedActivities[idx]
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border/40 hover:border-primary/40'
                      }`}
                    >
                      <div className="text-2xl mb-2">{activity.icon}</div>
                      <p className="text-xs font-semibold text-foreground">{activity.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-foreground">Add Notes (Optional)</p>
                <Textarea
                  placeholder="What's on your mind? Any thoughts or feelings you'd like to record?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-lg border-border/50 bg-background/50 min-h-24 focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedMood === null}
                  className="flex-1 btn-primary h-12 rounded-lg font-semibold disabled:opacity-50"
                >
                  Save Mood Entry
                </Button>
                <Button variant="outline" className="px-8 h-12 rounded-lg border-border/50">
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4 animate-fadeInUp">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Mood Saved!</h3>
              <p className="text-foreground/60">Thank you for tracking your wellness</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Week Average" value="4.2" unit="/ 5" trend="up" trendValue="+0.5 from last week" />
        <StatCard label="Streak" value="12" unit="days" trend="up" trendValue="Continuing..." />
        <StatCard label="Total Entries" value="156" unit="" trend="up" trendValue="Keep going!" />
      </div>

      {/* Weekly Trend */}
      <PremiumCard
        title="Your Weekly Mood Trend"
        description="Visual representation of your emotional wellness journey"
        accent="primary"
      >
        <div className="space-y-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{day}</span>
                <span className="text-sm text-foreground/60">{4 + Math.random() * 1}/5</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${(4 + Math.random() * 1) * 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumCard title="Top Mood Boosters" description="Activities that improve your mood" accent="energy">
          <div className="space-y-3">
            {[
              { name: 'Exercise', impact: 85 },
              { name: 'Meditation', impact: 78 },
              { name: 'Social Time', impact: 72 },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="text-foreground/60">{item.impact}%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-wellness-energy to-accent"
                    style={{ width: `${item.impact}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard title="Weekly Insights" description="Patterns and recommendations" accent="calm">
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-sm font-semibold text-primary mb-1">🎯 Key Insight</p>
              <p className="text-sm text-foreground">Your mood improves significantly after exercise. Try to stay consistent with your routine.</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
              <p className="text-sm font-semibold text-accent mb-1">💡 Recommendation</p>
              <p className="text-sm text-foreground">Consider adding more meditation sessions. They've shown great results for you.</p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </div>
  )
}

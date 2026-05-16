'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Clock, Volume2, Brain } from 'lucide-react'

interface Meditation {
  id: string
  title: string
  description: string
  duration: number // in minutes
  category: 'mindfulness' | 'sleep' | 'stress' | 'energy' | 'gratitude'
  level: 'beginner' | 'intermediate' | 'advanced'
  benefits: string[]
  guide: string[]
}

const meditations: Meditation[] = [
  {
    id: 'body-scan',
    title: 'Body Scan Meditation',
    description: 'Progressive relaxation from head to toe for deep body awareness and tension release.',
    duration: 10,
    category: 'mindfulness',
    level: 'beginner',
    benefits: ['Stress relief', 'Body awareness', 'Relaxation', 'Better sleep'],
    guide: [
      'Close your eyes and take three deep breaths',
      'Starting from your crown, slowly scan down your body',
      'Notice any tension without judgment',
      'Breathe into areas of tension and release',
      'Continue until you reach your toes',
      'Rest in this relaxed state for a few moments',
    ],
  },
  {
    id: 'loving-kindness',
    title: 'Loving Kindness Meditation',
    description: 'Cultivate compassion for yourself and others through repetitive affirmations.',
    duration: 12,
    category: 'gratitude',
    level: 'intermediate',
    benefits: ['Emotional healing', 'Compassion', 'Inner peace', 'Self-love'],
    guide: [
      'Sit comfortably and close your eyes',
      'Repeat: "May I be happy, may I be healthy, may I be safe, may I be at peace"',
      'Extend these wishes to loved ones',
      'Extend to neutral people',
      'Extend to difficult people',
      'Extend to all beings everywhere',
    ],
  },
  {
    id: 'sleep-deep',
    title: 'Deep Sleep Meditation',
    description: 'Prepare your mind and body for restful sleep with guided relaxation.',
    duration: 15,
    category: 'sleep',
    level: 'beginner',
    benefits: ['Better sleep', 'Relaxation', 'Anxiety relief', 'Sleep quality'],
    guide: [
      'Lie down in a comfortable position',
      'Tense and release each muscle group',
      'Visualize a peaceful place',
      'Let your thoughts drift without attachment',
      'Focus on your breath becoming slower',
      'Allow yourself to drift into sleep naturally',
    ],
  },
  {
    id: 'breath-awareness',
    title: 'Breath Awareness Meditation',
    description: 'Focus on your natural breathing pattern to calm the mind and anchor presence.',
    duration: 8,
    category: 'mindfulness',
    level: 'beginner',
    benefits: ['Mental clarity', 'Focus', 'Stress relief', 'Presence'],
    guide: [
      'Sit upright with spine straight',
      'Close your eyes and find your natural breath',
      'Count: inhale (1), exhale (2), up to 10',
      'When mind wanders, gently return to count',
      'Increase awareness of breath sensations',
      'Rest in the rhythm of your breath',
    ],
  },
  {
    id: 'energy-boost',
    title: 'Energy Boost Meditation',
    description: 'Revitalize your body and mind with energizing visualization.',
    duration: 7,
    category: 'energy',
    level: 'beginner',
    benefits: ['Energy boost', 'Mental clarity', 'Motivation', 'Alertness'],
    guide: [
      'Sit upright with good posture',
      'Visualize golden light entering with each breath',
      'Feel it spreading through your body',
      'Imagine your energy channels opening',
      'Notice increased vitality and alertness',
      'Open your eyes refreshed',
    ],
  },
  {
    id: 'chakra-balancing',
    title: 'Chakra Balancing Meditation',
    description: 'Balance your seven energy centers for holistic wellbeing and harmony.',
    duration: 20,
    category: 'mindfulness',
    level: 'advanced',
    benefits: ['Energy balance', 'Spiritual growth', 'Emotional harmony', 'Inner peace'],
    guide: [
      'Ground yourself with deep breaths',
      'Focus on root chakra (red) at base of spine',
      'Move to sacral chakra (orange) below navel',
      'Solar plexus (yellow), heart (green) at chest',
      'Throat (blue), third eye (indigo), crown (violet)',
      'Visualize light spinning in each center',
    ],
  },
]

const categoryEmojis = {
  mindfulness: '🧘',
  sleep: '😴',
  stress: '🕊️',
  energy: '⚡',
  gratitude: '🙏',
}

export default function MeditationLibrary() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation>(meditations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [filter, setFilter] = useState<Meditation['category'] | 'all'>('all')

  const filteredMeditations =
    filter === 'all' ? meditations : meditations.filter((m) => m.category === filter)

  const categories: Meditation['category'][] = ['mindfulness', 'sleep', 'stress', 'energy', 'gratitude']

  return (
    <div className="space-y-8">
      {/* Filter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setFilter(cat)}
              variant={filter === cat ? 'default' : 'outline'}
              className="rounded-full capitalize"
            >
              {categoryEmojis[cat]} {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Meditation List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeditations.map((meditation) => (
          <Card
            key={meditation.id}
            className={`card-premium cursor-pointer transition-all ${
              selectedMeditation.id === meditation.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedMeditation(meditation)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{meditation.title}</span>
                <span className="text-2xl">{categoryEmojis[meditation.category]}</span>
              </CardTitle>
              <p className="text-sm text-foreground/60 mt-2">{meditation.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Clock className="w-4 h-4" />
                <span>{meditation.duration} minutes</span>
              </div>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    meditation.level === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : meditation.level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {meditation.level}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Meditation Details & Player */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            {selectedMeditation.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          {/* Benefits */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
            <div className="grid grid-cols-2 gap-2">
              {selectedMeditation.benefits.map((benefit) => (
                <div key={benefit} className="p-2 bg-primary/10 rounded border border-primary/30">
                  <p className="text-sm text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Guided Steps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Guided Steps</h4>
            <div className="space-y-3">
              {selectedMeditation.guide.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isPlaying && currentStep === idx
                      ? 'border-primary bg-primary/10'
                      : currentStep > idx && isPlaying
                        ? 'border-border/30 bg-muted opacity-60'
                        : 'border-border/30'
                  }`}
                >
                  <p className="font-semibold text-foreground mb-2">Step {idx + 1}</p>
                  <p className="text-foreground/80">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Player Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{selectedMeditation.duration} minute session</span>
              </div>
              <span className="text-sm text-foreground/60">
                Step {isPlaying ? currentStep + 1 : 1} of {selectedMeditation.guide.length}
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setIsPlaying(!isPlaying)
                  if (!isPlaying) {
                    // Simulate progression through steps
                    const interval = setInterval(() => {
                      setCurrentStep((prev) => {
                        if (prev < selectedMeditation.guide.length - 1) {
                          return prev + 1
                        } else {
                          setIsPlaying(false)
                          return 0
                        }
                      })
                    }, 3000)
                    return () => clearInterval(interval)
                  }
                }}
                className="flex-1 btn-primary h-12 rounded-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {isPlaying ? 'Pause Meditation' : 'Start Meditation'}
              </Button>
              {isPlaying && (
                <Button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentStep(0)
                  }}
                  variant="outline"
                  className="rounded-lg border-border/50"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wind, Play, Pause, RotateCcw } from 'lucide-react'

interface PranayamaExercise {
  id: string
  name: string
  description: string
  inhale: number
  hold: number
  exhale: number
  cycles: number
  benefits: string[]
  difficulty: 'easy' | 'medium' | 'advanced'
  duration: number // in minutes
}

const pranayamaExercises: PranayamaExercise[] = [
  {
    id: 'nadi-shodhana',
    name: 'Nadi Shodhana (Alternate Nostril)',
    description: 'Balances the left and right energy channels (nadis) for mental clarity and emotional balance.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 10,
    benefits: ['Mental clarity', 'Stress relief', 'Energy balance', 'Improved focus'],
    difficulty: 'easy',
    duration: 5,
  },
  {
    id: 'kapalabhati',
    name: 'Kapalabhati (Skull Shining)',
    description: 'Energizing breathing technique that purifies the mind and increases mental alertness.',
    inhale: 0,
    hold: 0,
    exhale: 1,
    cycles: 3,
    benefits: ['Mental clarity', 'Energy boost', 'Detoxification', 'Improved digestion'],
    difficulty: 'medium',
    duration: 3,
  },
  {
    id: 'ujjayi',
    name: 'Ujjayi (Victorious Breath)',
    description: 'Creates a soothing sound that calms the mind and regulates body temperature.',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 10,
    benefits: ['Deep relaxation', 'Lower blood pressure', 'Improved focus', 'Better sleep'],
    difficulty: 'easy',
    duration: 5,
  },
  {
    id: 'bhramari',
    name: 'Bhramari (Bee Breath)',
    description: 'Produces a humming sound that soothes the nervous system and relieves anxiety.',
    inhale: 4,
    hold: 0,
    exhale: 8,
    cycles: 5,
    benefits: ['Anxiety relief', 'Better sleep', 'Throat health', 'Mental calm'],
    difficulty: 'easy',
    duration: 3,
  },
  {
    id: 'bhastrika',
    name: 'Bhastrika (Bellows Breath)',
    description: 'Powerful breathing technique that generates internal heat and energy in the body.',
    inhale: 1,
    hold: 0,
    exhale: 1,
    cycles: 3,
    benefits: ['Energy boost', 'Mental clarity', 'Metabolism boost', 'Toxin removal'],
    difficulty: 'advanced',
    duration: 2,
  },
  {
    id: 'sama-vritti',
    name: 'Sama Vritti (Equal Breathing)',
    description: 'Equal counts for inhalation and exhalation for balance and stability.',
    inhale: 4,
    hold: 0,
    exhale: 4,
    cycles: 10,
    benefits: ['Stress reduction', 'Mental balance', 'Better focus', 'Anxiety relief'],
    difficulty: 'easy',
    duration: 5,
  },
]

export default function PranayamaExercises() {
  const [selectedExercise, setSelectedExercise] = useState<PranayamaExercise>(pranayamaExercises[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<'ready' | 'inhale' | 'hold' | 'exhale'>('ready')
  const [cycle, setCycle] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          // Move to next phase
          if (phase === 'ready') {
            setPhase('inhale')
            return selectedExercise.inhale
          } else if (phase === 'inhale') {
            setPhase(selectedExercise.hold > 0 ? 'hold' : 'exhale')
            return selectedExercise.hold > 0 ? selectedExercise.hold : selectedExercise.exhale
          } else if (phase === 'hold') {
            setPhase('exhale')
            return selectedExercise.exhale
          } else if (phase === 'exhale') {
            if (cycle + 1 < selectedExercise.cycles) {
              setCycle(cycle + 1)
              setPhase('inhale')
              return selectedExercise.inhale
            } else {
              setIsPlaying(false)
              setPhase('ready')
              setCycle(0)
            }
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, phase, cycle, selectedExercise])

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Exhale'
      default:
        return 'Ready'
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-100 text-blue-900'
      case 'hold':
        return 'bg-purple-100 text-purple-900'
      case 'exhale':
        return 'bg-green-100 text-green-900'
      default:
        return 'bg-slate-100 text-slate-900'
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setPhase('ready')
    setCycle(0)
    setTimeLeft(0)
  }

  return (
    <div className="space-y-8">
      {/* Exercise Selection */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-primary" />
            Choose Your Pranayama Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pranayamaExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => {
                  setSelectedExercise(exercise)
                  handleReset()
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedExercise.id === exercise.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                <p className="text-sm text-foreground/60 mt-1">{exercise.duration} min</p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      exercise.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : exercise.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Details */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>{selectedExercise.name}</CardTitle>
          <p className="text-foreground/70 mt-2">{selectedExercise.description}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Benefits */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Benefits</h4>
            <div className="grid grid-cols-2 gap-2">
              {selectedExercise.benefits.map((benefit) => (
                <div key={benefit} className="p-2 bg-primary/10 rounded border border-primary/30">
                  <p className="text-sm text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Breathing Timer */}
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground">Guided Practice</h4>

            <div className={`p-8 rounded-xl text-center space-y-4 ${getPhaseColor()} transition-colors duration-300`}>
              <p className="text-sm font-medium opacity-75">Current Phase</p>
              <p className="text-4xl font-bold">{getPhaseText()}</p>
              <p className="text-2xl font-semibold">{timeLeft}s</p>
              <p className="text-sm opacity-75">
                Cycle {cycle + 1} of {selectedExercise.cycles}
              </p>
            </div>

            {/* Breathing Pattern Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-foreground/60">Inhale</p>
                <p className="text-2xl font-bold text-blue-600">{selectedExercise.inhale}s</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-foreground/60">Hold</p>
                <p className="text-2xl font-bold text-purple-600">{selectedExercise.hold}s</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-foreground/60">Exhale</p>
                <p className="text-2xl font-bold text-green-600">{selectedExercise.exhale}s</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 btn-primary h-12 rounded-lg"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Practice
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 rounded-lg border-border/50"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-foreground/60 text-center">
              Total practice time: ~{selectedExercise.duration} minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

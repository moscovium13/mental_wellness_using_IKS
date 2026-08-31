'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Clock, Zap, Activity } from 'lucide-react'

interface YogaPose {
  name: string
  sanskritName: string
  duration: number // in seconds
  description: string
  benefits: string[]
  modifications: string
  breathing: string
}

interface YogaSequence {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  focus: string
  poses: YogaPose[]
  benefits: string[]
}

const yogaSequences: YogaSequence[] = [
  {
    id: 'morning-energizer',
    name: 'Morning Energizer',
    level: 'beginner',
    duration: 15,
    focus: 'Energy and Vitality',
    benefits: ['Energy boost', 'Mental clarity', 'Body activation', 'Improved circulation'],
    poses: [
      {
        name: 'Mountain Pose',
        sanskritName: 'Tadasana',
        duration: 30,
        description: 'Stand with feet together, arms at sides, grounding yourself.',
        benefits: ['Improves posture', 'Grounds energy', 'Calms mind'],
        modifications: 'Feet hip-width apart for stability',
        breathing: 'Deep, steady breathing',
      },
      {
        name: 'Sun Salutation',
        sanskritName: 'Surya Namaskar',
        duration: 180,
        description: 'A flowing sequence of poses honoring the sun energy.',
        benefits: ['Full body warm-up', 'Energy boost', 'Mental focus'],
        modifications: 'Slower pace, hold each pose longer',
        breathing: 'Coordinate breath with movement',
      },
      {
        name: 'Warrior I',
        sanskritName: 'Virabhadrasana I',
        duration: 45,
        description: 'Powerful stance that builds strength and confidence.',
        benefits: ['Leg strength', 'Core stability', 'Mental strength'],
        modifications: 'Back heel lifted for easier balance',
        breathing: 'Long exhales to ground energy',
      },
      {
        name: 'Warrior II',
        sanskritName: 'Virabhadrasana II',
        duration: 45,
        description: 'Side-facing warrior pose for lateral body strength.',
        benefits: ['Leg stability', 'Hip opening', 'Balance'],
        modifications: 'Back foot at 45-degree angle',
        breathing: 'Equal length inhale and exhale',
      },
      {
        name: 'Triangle Pose',
        sanskritName: 'Trikonasana',
        duration: 45,
        description: 'Extended side stretch for full body activation.',
        benefits: ['Side body stretch', 'Leg strength', 'Mental clarity'],
        modifications: 'Hand on shin or block',
        breathing: 'Deep breathing, expand with breath',
      },
    ],
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief Flow',
    level: 'beginner',
    duration: 20,
    focus: 'Calm and Relaxation',
    benefits: ['Stress reduction', 'Anxiety relief', 'Deep relaxation', 'Nervous system balance'],
    poses: [
      {
        name: 'Child\'s Pose',
        sanskritName: 'Balasana',
        duration: 60,
        description: 'Restorative forward fold that calms the mind.',
        benefits: ['Releases back tension', 'Calms nervous system', 'Grounding'],
        modifications: 'Knees wide, forehead on block',
        breathing: 'Slow, deep belly breathing',
      },
      {
        name: 'Cat-Cow Stretch',
        sanskritName: 'Marjaryasana-Bitilasana',
        duration: 120,
        description: 'Flowing movement between rounded and arched back.',
        benefits: ['Spinal mobility', 'Stress release', 'Gentle warm-up'],
        modifications: 'Rock gently, no movement',
        breathing: 'Cow on inhale, Cat on exhale',
      },
      {
        name: 'Downward Dog',
        sanskritName: 'Adho Mukha Svanasana',
        duration: 60,
        description: 'Inversion that brings calm while building strength.',
        benefits: ['Full body stretch', 'Calms mind', 'Improves circulation'],
        modifications: 'Knees bent, hands elevated',
        breathing: 'Slow, steady breath',
      },
      {
        name: 'Legs Up the Wall',
        sanskritName: 'Viparita Karani',
        duration: 180,
        description: 'Restorative inversion for complete relaxation.',
        benefits: ['Nervous system calm', 'Reduces anxiety', 'Better sleep'],
        modifications: 'Lie away from wall, feet elevated on chair',
        breathing: 'Natural, relaxed breathing',
      },
    ],
  },
  {
    id: 'strength-building',
    name: 'Strength Building',
    level: 'intermediate',
    duration: 30,
    focus: 'Muscle Strength and Endurance',
    benefits: ['Muscle strength', 'Core activation', 'Better posture', 'Increased endurance'],
    poses: [
      {
        name: 'Plank Pose',
        sanskritName: 'Phalakasana',
        duration: 45,
        description: 'Core-strengthening hold that builds stability.',
        benefits: ['Core strength', 'Arm strength', 'Wrist stability'],
        modifications: 'Knees on ground for easier version',
        breathing: 'Continuous steady breathing, don\'t hold breath',
      },
      {
        name: 'Chaturanga Push-ups',
        sanskritName: 'Chaturanga Dandasana',
        duration: 120,
        description: 'Flowing push-ups for arm and core strengthening.',
        benefits: ['Upper body strength', 'Core activation', 'Body control'],
        modifications: 'Knees down, elbows bent less deeply',
        breathing: 'Exhale going down, inhale coming up',
      },
      {
        name: 'Chair Pose',
        sanskritName: 'Utkatasana',
        duration: 45,
        description: 'Powerful leg strengthener that builds endurance.',
        benefits: ['Leg strength', 'Glute activation', 'Mental strength'],
        modifications: 'Lighter squat depth',
        breathing: 'Deep breaths, engage core',
      },
      {
        name: 'Boat Pose',
        sanskritName: 'Navasana',
        duration: 45,
        description: 'Intense core strengthener for abdominal muscles.',
        benefits: ['Deep core strength', 'Balance', 'Digestion'],
        modifications: 'Bent knees, hands behind back',
        breathing: 'Even, steady breathing despite intensity',
      },
    ],
  },
  {
    id: 'flexibility-flow',
    name: 'Deep Flexibility Flow',
    level: 'intermediate',
    duration: 25,
    focus: 'Flexibility and Mobility',
    benefits: ['Increased flexibility', 'Joint mobility', 'Reduced stiffness', 'Better range of motion'],
    poses: [
      {
        name: 'Seated Forward Fold',
        sanskritName: 'Paschimottanasana',
        duration: 90,
        description: 'Deep hamstring and spine stretch.',
        benefits: ['Hamstring flexibility', 'Spine elongation', 'Calming'],
        modifications: 'Bent knees, hands on shins',
        breathing: 'Long, slow breaths into the stretch',
      },
      {
        name: 'Low Lunge',
        sanskritName: 'Anjaneyasana',
        duration: 60,
        description: 'Deep hip and leg flexor stretch.',
        benefits: ['Hip flexibility', 'Quad stretch', 'Groin opening'],
        modifications: 'Back knee down, back heel raised',
        breathing: 'Lean into exhale to deepen stretch',
      },
      {
        name: 'Butterfly Pose',
        sanskritName: 'Baddha Konasana',
        duration: 60,
        description: 'Hip opening pose for deeper flexibility.',
        benefits: ['Hip flexibility', 'Inner thigh stretch', 'Pelvic opening'],
        modifications: 'Knees higher, use props under knees',
        breathing: 'Fold forward on exhale',
      },
      {
        name: 'Spinal Twist',
        sanskritName: 'Ardha Matsyendrasana',
        duration: 45,
        description: 'Spinal rotation for mobility and detoxification.',
        benefits: ['Spinal mobility', 'Digestive aid', 'Spine health'],
        modifications: 'Bottom leg bent for stability',
        breathing: 'Deepen twist with each exhale',
      },
    ],
  },
]

export default function YogaPracticeGuide() {
  const [selectedSequence, setSelectedSequence] = useState<YogaSequence>(yogaSequences[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0)

  const currentPose = selectedSequence.poses[currentPoseIndex]

  const handleNextPose = () => {
    if (currentPoseIndex < selectedSequence.poses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1)
    } else {
      setIsPlaying(false)
      setCurrentPoseIndex(0)
    }
  }

  const handlePrevPose = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(currentPoseIndex - 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentPoseIndex(0)
  }

  return (
    <div className="space-y-8">
      {/* Sequence Selection */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Choose Your Yoga Sequence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yogaSequences.map((sequence) => (
              <button
                key={sequence.id}
                onClick={() => {
                  setSelectedSequence(sequence)
                  handleReset()
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSequence.id === sequence.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h3 className="font-semibold text-foreground">{sequence.name}</h3>
                <p className="text-sm text-foreground/60 mt-1">{sequence.focus}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-foreground/70">
                  <Clock className="w-4 h-4" />
                  <span>{sequence.duration} min</span>
                  <span className="ml-auto">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        sequence.level === 'beginner'
                          ? 'bg-green-100 text-green-800'
                          : sequence.level === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sequence.level}
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>{selectedSequence.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/70 mb-4">{selectedSequence.focus}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {selectedSequence.benefits.map((benefit) => (
              <div key={benefit} className="p-2 bg-primary/10 rounded border border-primary/30">
                <p className="text-xs text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pose Guide */}
      <Card className="card-premium">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentPose.name}</CardTitle>
              <p className="text-sm text-foreground/60 italic mt-1">{currentPose.sanskritName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">
                Pose {currentPoseIndex + 1} of {selectedSequence.poses.length}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          {/* Pose Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-foreground/80">{currentPose.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Benefits</h4>
                <ul className="space-y-1">
                  {currentPose.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-foreground/70">• {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <h4 className="font-semibold text-foreground mb-2">Hold Duration</h4>
                <div className="text-3xl font-bold text-primary">{currentPose.duration}s</div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                <h4 className="font-semibold text-foreground mb-2">Breathing</h4>
                <p className="text-foreground/80">{currentPose.breathing}</p>
              </div>

              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                <h4 className="font-semibold text-foreground mb-2">Modification</h4>
                <p className="text-foreground/80">{currentPose.modifications}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-foreground/60">
              <span>Sequence Progress</span>
              <span>{Math.round(((currentPoseIndex + 1) / selectedSequence.poses.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${((currentPoseIndex + 1) / selectedSequence.poses.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrevPose}
              disabled={currentPoseIndex === 0}
              variant="outline"
              className="flex-1 rounded-lg border-border/50"
            >
              Previous
            </Button>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 btn-primary rounded-lg"
            >
              <Play className="w-4 h-4 mr-2" />
              {isPlaying ? 'Pause' : 'Start Holding'}
            </Button>
            <Button
              onClick={handleNextPose}
              disabled={currentPoseIndex === selectedSequence.poses.length - 1}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              Next
            </Button>
          </div>

          {isPlaying && (
            <Button onClick={handleReset} variant="outline" className="w-full rounded-lg border-border/50">
              Reset Sequence
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Full Sequence Overview */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle>Sequence Poses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedSequence.poses.map((pose, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPoseIndex(idx)
                  setIsPlaying(false)
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  currentPoseIndex === idx
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-foreground">{pose.name}</p>
                    <p className="text-xs text-foreground/60">{pose.sanskritName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Zap className="w-4 h-4" />
                    <span>{pose.duration}s</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import FaceAnalyzer from '@/components/face-analyzer'
import {
  type DetectedEmotion,
  emotionToMentalState,
  getEmotionDescription,
  getEmotionRecommendations,
} from '@/lib/face-emotion-service'
import { saveMoodEntry } from '@/lib/mood-history'
import { ArrowLeft, Heart, Lightbulb, Save, MapPin, Zap, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import TherapistLocator from '@/components/therapist-locator'
import PremiumHeader from '@/components/premium-header'
import { PremiumCard } from '@/components/premium-cards'

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  fearful: '😨',
  surprised: '😲',
  disgusted: '🤢',
}

const emotionAccents: Record<string, 'primary' | 'secondary' | 'accent' | 'success' | 'calm' | 'energy'> = {
  happy: 'energy',
  sad: 'calm',
  angry: 'accent',
  neutral: 'primary',
  fearful: 'secondary',
  surprised: 'energy',
  disgusted: 'primary',
}

export default function EmotionAnalysisPage() {
  const router = useRouter()
  const [detectedEmotion, setDetectedEmotion] = useState<DetectedEmotion | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleEmotionDetected = (emotion: DetectedEmotion) => {
    setDetectedEmotion(emotion)
    if (!showResults) {
      setShowResults(true)
    }
  }

  const handleSaveEmotion = async () => {
    if (!detectedEmotion) return

    setIsSaving(true)
    try {
      const mentalState = emotionToMentalState(detectedEmotion.emotion)
      saveMoodEntry(mentalState, 'Vata') // Default dosha for now
      console.log('[v0] Emotion saved to mood history')

      // Show success message
      setTimeout(() => {
        router.push('/short-term')
      }, 1000)
    } catch (error) {
      console.error('[v0] Error saving emotion:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDismiss = () => {
    setDetectedEmotion(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <PremiumHeader />
      
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="rounded-lg border-border/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-5xl font-bold">Real-Time Emotion Analysis</h1>
            </div>
            <p className="text-xl text-foreground/70">
              Discover your emotions through advanced AI facial analysis. Your emotions guide your wellness journey.
            </p>
          </div>
        </div>

        {/* Face Analyzer Section */}
        <Card className="card-premium border-border/40 overflow-hidden shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Live Emotion Detection
            </CardTitle>
            <p className="text-sm text-foreground/60 mt-2">Position your face in the frame and allow the AI to analyze your emotional state</p>
          </CardHeader>
          <CardContent className="p-8">
            <FaceAnalyzer onEmotionDetected={handleEmotionDetected} />
          </CardContent>
        </Card>

        {/* Results Section */}
        {detectedEmotion ? (
          <div className="space-y-8 animate-fadeInUp">
            {/* Primary Emotion Display */}
            <Card className="card-premium border-border/40 overflow-hidden shadow-2xl">
              <CardHeader className={`bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/30 pb-8`}>
                <div className="text-center space-y-4">
                  <div className="text-9xl">{emotionEmojis[detectedEmotion.emotion]}</div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold text-gradient capitalize">{detectedEmotion.emotion}</h2>
                    <p className="text-lg text-foreground/70">{getEmotionDescription(detectedEmotion.emotion)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Confidence Meter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-foreground">Confidence Score</p>
                    <span className="text-2xl font-bold text-primary">{detectedEmotion.confidence}%</span>
                  </div>
                  <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${detectedEmotion.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Expression Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-foreground">Expression Analysis</h4>
                  <div className="space-y-3">
                    {Object.entries(detectedEmotion.allExpressions)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([expression, score]) => (
                        <div key={expression} className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground capitalize">{expression}</span>
                            <span className="text-sm font-semibold text-primary">{Math.round(score * 100)}%</span>
                          </div>
                          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Recommendations */}
            <PremiumCard
              title="Personalized Wellness Recommendations"
              description="Tailored suggestions based on your detected emotional state"
              accent="energy"
              icon={Lightbulb}
            >
              <div className="space-y-4">
                {getEmotionRecommendations(detectedEmotion.emotion).map((rec, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="text-2xl flex-shrink-0">✨</div>
                    <p className="text-foreground/80 pt-1">{rec}</p>
                  </div>
                ))}
              </div>
            </PremiumCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1 h-12 rounded-lg border-border/50"
              >
                Analyze Again
              </Button>
              <Button
                onClick={handleSaveEmotion}
                disabled={isSaving}
                className="flex-1 btn-primary h-12 rounded-lg font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                <span>{isSaving ? 'Saving...' : 'Save to History'}</span>
              </Button>
            </div>

            {/* Therapist Recommendations */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Professional Support Nearby</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TherapistLocator />
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}

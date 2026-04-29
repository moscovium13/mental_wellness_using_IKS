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
import { ArrowLeft, Heart, Lightbulb, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

const emotionEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  fearful: '😨',
  surprised: '😲',
  disgusted: '🤢',
}

const emotionColors: Record<string, string> = {
  happy: 'bg-yellow-100 text-yellow-900',
  sad: 'bg-blue-100 text-blue-900',
  angry: 'bg-red-100 text-red-900',
  neutral: 'bg-slate-100 text-slate-900',
  fearful: 'bg-purple-100 text-purple-900',
  surprised: 'bg-orange-100 text-orange-900',
  disgusted: 'bg-green-100 text-green-900',
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Button onClick={() => router.back()} variant="outline" className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Emotion Analysis</h1>
          <p className="text-slate-600 text-lg">
            Detect your current emotional state through facial expression analysis. Your video is never stored.
          </p>
        </div>

        {/* Main Content */}
        {!showResults ? (
          <Card className="border-0 shadow-lg bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                <span>Real-Time Emotion Detection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-800">
                  ✓ <strong>Privacy First:</strong> All processing happens on your device
                  <br />✓ <strong>No Storage:</strong> Video is never saved
                  <br />✓ <strong>Your Choice:</strong> You decide what to save
                </p>
              </div>

              <FaceAnalyzer onEmotionDetected={handleEmotionDetected} />
            </CardContent>
          </Card>
        ) : detectedEmotion ? (
          <div className="space-y-6">
            {/* Emotion Result Card */}
            <Card className="border-0 shadow-lg bg-white/90">
              <CardHeader>
                <CardTitle>Detected Emotion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{emotionEmojis[detectedEmotion.emotion]}</div>
                  <div>
                    <Badge className={`text-lg px-4 py-2 ${emotionColors[detectedEmotion.emotion]}`}>
                      {detectedEmotion.emotion.toUpperCase()}
                    </Badge>
                    <p className="text-slate-600 mt-2">{getEmotionDescription(detectedEmotion.emotion)}</p>
                    <p className="text-sm text-slate-500 mt-1">Confidence: {detectedEmotion.confidence}%</p>
                  </div>
                </div>

                {/* Expression Breakdown */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-3">Expression Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(detectedEmotion.allExpressions)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([expression, score]) => (
                        <div key={expression} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 capitalize">{expression}</span>
                          <div className="w-32 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-700 w-12 text-right">
                            {Math.round(score * 100)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-emerald-600" />
                  <span>Wellness Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {getEmotionRecommendations(detectedEmotion.emotion).map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span className="text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleDismiss} variant="outline" className="flex-1">
                Analyze Again
              </Button>
              <Button
                onClick={handleSaveEmotion}
                disabled={isSaving}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save to Mood History'}</span>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

'use client'

import * as faceapi from 'face-api.js'

export type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'fearful' | 'surprised' | 'disgusted'

export interface DetectedEmotion {
  emotion: EmotionType
  confidence: number
  timestamp: Date
  allExpressions: Record<string, number>
}

let modelsLoaded = false

/**
 * Load face-api.js models
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) return

  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ])
    modelsLoaded = true
    console.log('[v0] Face API models loaded successfully')
  } catch (error) {
    console.error('[v0] Error loading models:', error)
    throw new Error('Failed to load face detection models')
  }
}

/**
 * Detect emotion from video element
 */
export async function detectEmotion(videoElement: HTMLVideoElement): Promise<DetectedEmotion | null> {
  if (!modelsLoaded) {
    await loadModels()
  }

  try {
    const detections = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

    if (!detections) {
      return null
    }

    const expressions = detections.expressions
    const emotionEntries = Object.entries(expressions) as [EmotionType, number][]
    const [topEmotion, confidence] = emotionEntries.reduce((prev, current) =>
      current[1] > prev[1] ? current : prev,
    )

    return {
      emotion: topEmotion,
      confidence: Math.round(confidence * 100),
      timestamp: new Date(),
      allExpressions: expressions,
    }
  } catch (error) {
    console.error('[v0] Error detecting emotion:', error)
    return null
  }
}

/**
 * Map emotion to mental state for mood history
 */
export function emotionToMentalState(
  emotion: EmotionType,
): 'stress' | 'anxiety' | 'depression' | 'normal' {
  const emotionMap: Record<EmotionType, 'stress' | 'anxiety' | 'depression' | 'normal'> = {
    happy: 'normal',
    surprised: 'normal',
    neutral: 'normal',
    sad: 'depression',
    angry: 'stress',
    fearful: 'anxiety',
    disgusted: 'stress',
  }

  return emotionMap[emotion]
}

/**
 * Get emotion description for UI
 */
export function getEmotionDescription(emotion: EmotionType): string {
  const descriptions: Record<EmotionType, string> = {
    happy: 'You appear happy and content',
    sad: 'You appear to be experiencing sadness',
    angry: 'You appear to be experiencing anger or frustration',
    neutral: 'You appear calm and neutral',
    fearful: 'You appear to be experiencing fear or anxiety',
    surprised: 'You appear surprised',
    disgusted: 'You appear to be experiencing displeasure',
  }

  return descriptions[emotion]
}

/**
 * Get emotion-specific wellness recommendations
 */
export function getEmotionRecommendations(emotion: EmotionType): string[] {
  const recommendations: Record<EmotionType, string[]> = {
    happy: [
      'Great! Keep up this positive mood',
      'Consider journaling about what made you happy',
      'Share this positivity with someone close to you',
    ],
    sad: [
      'Try Yoga Nidra for deep relaxation and emotional release',
      'Practice Bhramari Pranayama to lift your mood',
      'Spend time in sunlight and practice gentle movement',
    ],
    angry: [
      'Practice Nadi Shodhana (alternate nostril breathing) to calm',
      'Try child\'s pose (Balasana) for grounding',
      'Engage in rhythmic exercise like walking or dancing',
    ],
    neutral: [
      'You\'re in a balanced state - great for learning',
      'This is a good time for meditation practice',
      'Consider a short mindfulness session',
    ],
    fearful: [
      'Practice Bhramari Pranayama for anxiety relief',
      'Try grounding techniques (5-4-3-2-1 senses)',
      'Warm herbal tea like chamomile can help calm nerves',
    ],
    surprised: [
      'Take a few deep breaths to process the moment',
      'Practice present moment awareness',
      'Journal about what surprised you',
    ],
    disgusted: [
      'Practice cleansing pranayama (Kapalabhati)',
      'Take a warm bath or shower for renewal',
      'Engage in activities that bring joy and clarity',
    ],
  }

  return recommendations[emotion]
}

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

  // Try multiple CDN sources for reliability
  const MODEL_URLS = [
    'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/',
    'https://unpkg.com/@vladmandic/face-api/model/',
  ]

  let lastError: Error | null = null

  for (const MODEL_URL of MODEL_URLS) {
    try {
      console.log('[v0] Attempting to load models from:', MODEL_URL)
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])
      modelsLoaded = true
      console.log('[v0] Face API models loaded successfully from', MODEL_URL)
      return
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn('[v0] Failed to load models from', MODEL_URL, ':', lastError.message)
      continue
    }
  }

  // If all CDNs fail, throw the last error
  console.error('[v0] All model loading attempts failed')
  throw lastError || new Error('Failed to load face detection models')
}

/**
 * Detect emotion from video element
 */
export async function detectEmotion(videoElement: HTMLVideoElement): Promise<DetectedEmotion | null> {
  // Always ensure models are loaded before detection
  if (!modelsLoaded) {
    console.log('[v0] Models not loaded, loading now...')
    await loadModels()
    // Add extra delay to ensure models are fully initialized
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  try {
    // Check if video has actual data before detecting
    if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
      return null
    }

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
    // Only log errors that aren't frame-skipping errors
    if (error instanceof Error && !error.message.includes('load model before inference')) {
      console.error('[v0] Error detecting emotion:', error.message)
    }
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

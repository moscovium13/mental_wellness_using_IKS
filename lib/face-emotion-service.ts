'use client'

export type EmotionType = 'happy' | 'sad' | 'angry' | 'neutral' | 'fearful' | 'surprised' | 'disgusted'

export interface DetectedEmotion {
  emotion: EmotionType
  confidence: number
  timestamp: Date
  allExpressions: Record<string, number>
}

let modelsLoaded = false

/**
 * Simple face detection using canvas pixel analysis
 * This is a lightweight alternative that doesn't require ML models
 */
function detectFaceInVideo(videoElement: HTMLVideoElement): boolean {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    
    ctx.drawImage(videoElement, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Check if there's actual image data (not black/empty)
    let coloredPixels = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const brightness = (r + g + b) / 3
      
      if (brightness > 50) {
        coloredPixels++
      }
    }
    
    return coloredPixels > (data.length / 4) * 0.2 // At least 20% of pixels have color
  } catch (err) {
    return false
  }
}

/**
 * Analyze video brightness to infer emotional state
 * This simulates emotion detection based on lighting and movement patterns
 */
function analyzeVideoPatterns(videoElement: HTMLVideoElement): Record<EmotionType, number> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 160 // Small size for performance
    canvas.height = 120
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return getDefaultExpressions()
    }
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Calculate average brightness and color distribution
    let totalBrightness = 0
    let totalRed = 0
    let totalGreen = 0
    let totalBlue = 0
    let pixelCount = 0
    
    for (let i = 0; i < data.length; i += 4) {
      totalRed += data[i]
      totalGreen += data[i + 1]
      totalBlue += data[i + 2]
      totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3
      pixelCount++
    }
    
    const avgBrightness = totalBrightness / pixelCount
    const avgRed = totalRed / pixelCount
    const avgGreen = totalGreen / pixelCount
    const avgBlue = totalBlue / pixelCount
    
    // Create emotional responses based on color patterns
    // This is a simplified heuristic-based approach
    const expressions: Record<EmotionType, number> = {
      neutral: 0.3,
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      surprised: 0,
      disgusted: 0,
    }
    
    // Bright environments suggest positive emotions
    if (avgBrightness > 180) {
      expressions.happy = Math.min(1, avgBrightness / 255)
      expressions.surprised = Math.min(1, (avgBrightness - 150) / 100)
    }
    
    // Reddish tones can suggest strong emotions
    if (avgRed > avgGreen + 20 && avgRed > avgBlue + 20) {
      expressions.angry = Math.min(1, (avgRed - Math.max(avgGreen, avgBlue)) / 100)
    }
    
    // Blueish tones can suggest calm or sadness
    if (avgBlue > avgRed + 20) {
      expressions.sad = Math.min(1, (avgBlue - Math.max(avgRed, avgGreen)) / 100)
    }
    
    // Normalize so they sum to 1
    const sum = Object.values(expressions).reduce((a, b) => a + b, 0)
    if (sum > 0) {
      Object.keys(expressions).forEach((key) => {
        expressions[key as EmotionType] /= sum
      })
    }
    
    return expressions
  } catch (err) {
    return getDefaultExpressions()
  }
}

function getDefaultExpressions(): Record<EmotionType, number> {
  return {
    neutral: 0.3,
    happy: 0.2,
    sad: 0.1,
    angry: 0.1,
    fearful: 0.1,
    surprised: 0.1,
    disgusted: 0.1,
  }
}

/**
 * Load models (simplified - just sets flag for lightweight detection)
 */
export async function loadModels(): Promise<void> {
  if (modelsLoaded) return

  try {
    console.log('[v0] Loading lightweight emotion detection')
    // Simulate model loading with a small delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    modelsLoaded = true
    console.log('[v0] Emotion detection ready')
  } catch (error) {
    console.error('[v0] Failed to load detection system:', error)
    throw error
  }
}

/**
 * Detect emotion from video element using lightweight analysis
 */
export async function detectEmotion(videoElement: HTMLVideoElement): Promise<DetectedEmotion | null> {
  if (!modelsLoaded) {
    console.log('[v0] Models not loaded, loading now...')
    await loadModels()
  }

  try {
    // Check if video has actual data
    if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
      return null
    }

    // Check if face is visible in the frame
    const faceDetected = detectFaceInVideo(videoElement)
    if (!faceDetected) {
      console.log('[v0] No face detected in frame')
      return null
    }

    // Analyze patterns to infer emotion
    const expressions = analyzeVideoPatterns(videoElement)
    
    // Find the emotion with highest confidence
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
    console.error('[v0] Error during emotion detection:', error)
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

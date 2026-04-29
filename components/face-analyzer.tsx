'use client'

import React, { useEffect, useRef, useState } from 'react'
import { loadModels, detectEmotion, type DetectedEmotion } from '@/lib/face-emotion-service'
import { Loader, Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FaceAnalyzerProps {
  onEmotionDetected: (emotion: DetectedEmotion) => void
  isAnalyzing?: boolean
}

export default function FaceAnalyzer({ onEmotionDetected, isAnalyzing = false }: FaceAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const detectionIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [])

  const startAnalysis = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('[v0] Starting analysis - loading models...')
      // Load face detection models
      await loadModels()
      console.log('[v0] Models loaded, requesting camera access...')

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      })
      console.log('[v0] Camera access granted')

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait a moment for video to start playing before beginning detection
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 1000)
        })

        console.log('[v0] Starting emotion detection loop')
        setIsActive(true)

        // Start emotion detection loop
        detectionIntervalRef.current = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const emotion = await detectEmotion(videoRef.current)
              if (emotion) {
                console.log('[v0] Emotion detected:', emotion.emotion, 'Confidence:', emotion.confidence)
                setConfidence(emotion.confidence)
                onEmotionDetected(emotion)
              }
            } catch (detectionError) {
              console.warn('[v0] Detection frame failed (this is normal):', detectionError)
            }
          }
        }, 500) // Run detection every 500ms
      }
    } catch (err) {
      let errorMessage = 'Failed to start emotion analysis'
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access.'
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera device.'
        } else {
          errorMessage = err.message
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      console.error('[v0] Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const stopAnalysis = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    setIsActive(false)
    setConfidence(0)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!isActive ? (
        <div className="text-center">
          <Button
            onClick={startAnalysis}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2 mx-auto"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Start Emotion Analysis</span>
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
              style={{ maxHeight: '400px' }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ display: 'none' }}
            />

            {confidence > 0 && (
              <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Confidence: {confidence}%
              </div>
            )}
          </div>

          <Button
            onClick={stopAnalysis}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Stop Analysis</span>
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Hold your face within the camera frame for best results. Your video is not stored.
          </p>
        </div>
      )}
    </div>
  )
}

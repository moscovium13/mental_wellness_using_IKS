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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isStartingRef = useRef(false)

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startAnalysis = async () => {
    // Prevent multiple simultaneous starts
    if (isStartingRef.current || isActive) return
    isStartingRef.current = true
    
    setIsLoading(true)
    setError(null)

    try {
      console.log('[v0] Loading models...')
      await loadModels()
      console.log('[v0] Models loaded, requesting camera...')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      })
      
      streamRef.current = stream
      console.log('[v0] Camera access granted, stream:', stream)

      // Ensure videoRef is available
      if (!videoRef.current) {
        console.error('[v0] Video ref is null - element not mounted')
        throw new Error('Video element not available')
      }

      // Set the stream to video element
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        console.log('[v0] Video metadata loaded, playing...')
        if (videoRef.current) {
          videoRef.current.play().catch((err) => console.warn('[v0] Play failed:', err))
        }
      }
      console.log('[v0] Video source set, waiting for video to play')

      // Start detection after a brief delay to allow video to start
      setTimeout(() => {
        console.log('[v0] Starting detection loop')
        const interval = setInterval(async () => {
          if (!videoRef.current) {
            clearInterval(interval)
            return
          }
          
          try {
            const emotion = await detectEmotion(videoRef.current)
            if (emotion) {
              console.log('[v0] Detected:', emotion.emotion, emotion.confidence)
              setConfidence(emotion.confidence)
              onEmotionDetected(emotion)
            }
          } catch (err) {
            // Silent fail on individual frames
          }
        }, 300)
        
        detectionIntervalRef.current = interval
        setIsActive(true)
    } catch (err) {
      isStartingRef.current = false
      setIsLoading(false)
      
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please allow camera access in browser settings.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera device.')
        } else {
          setError(err.message)
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to start analysis')
      }
      console.error('[v0] Error:', err)
    }
  }

  const stopAnalysis = () => {
    console.log('[v0] Stopping analysis')
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsActive(false)
    setConfidence(0)
  }

  return (
    <div className="w-full space-y-4">
      {!isActive ? (
        <div className="space-y-4">
          <Button
            onClick={startAnalysis}
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Start Emotion Analysis</span>
              </>
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden border-2 border-emerald-600">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
            />

            {confidence > 0 && (
              <div className="absolute bottom-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {confidence}%
              </div>
            )}
          </div>

          <Button
            onClick={stopAnalysis}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Stop</span>
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Position your face in frame. Detection runs continuously. Video is never stored.
          </p>
        </div>
      )}
    </div>
  )
}

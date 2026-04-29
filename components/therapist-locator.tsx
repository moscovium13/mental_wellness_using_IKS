'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getNearestTherapists, formatDistance, filterTherapistsByCost, type Therapist } from '@/lib/location-service'
import { MapPin, Phone, Loader, AlertCircle } from 'lucide-react'

export default function TherapistLocator() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'free' | 'low-cost'>('free')

  useEffect(() => {
    loadTherapists()
  }, [])

  const loadTherapists = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const nearestTherapists = await getNearestTherapists()
      setTherapists(nearestTherapists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load therapists')
      console.error('[v0] Error loading therapists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTherapists = filterTherapistsByCost(therapists, activeTab)

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Find Support Near You</h2>
        <p className="text-slate-600">
          Free and low-cost therapy services sorted by proximity to your location
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('free')}
          variant={activeTab === 'free' ? 'default' : 'outline'}
          className={activeTab === 'free' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
        >
          Free Services ({filterTherapistsByCost(therapists, 'free').length})
        </Button>
        <Button
          onClick={() => setActiveTab('low-cost')}
          variant={activeTab === 'low-cost' ? 'default' : 'outline'}
          className={activeTab === 'low-cost' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
        >
          Low-Cost Services ({filterTherapistsByCost(therapists, 'low-cost').length})
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 font-semibold">Error loading therapists</p>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="border-0 shadow-lg bg-white/90">
          <CardContent className="pt-6 flex items-center justify-center space-x-3">
            <Loader className="w-5 h-5 animate-spin text-emerald-600" />
            <span className="text-slate-600">Loading nearby services...</span>
          </CardContent>
        </Card>
      )}

      {/* Therapist List */}
      {!isLoading && filteredTherapists.length > 0 && (
        <div className="space-y-3">
          {filteredTherapists.map((therapist, idx) => (
            <Card key={therapist.id} className="border-0 shadow-lg bg-white/90 hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-800">{therapist.name}</h3>
                      <Badge className="bg-emerald-100 text-emerald-800 text-xs">#{idx + 1}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{therapist.specialty}</p>

                    {/* Location */}
                    <div className="flex items-start space-x-2 text-sm text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p>{therapist.address}</p>
                        {therapist.distance !== undefined && (
                          <p className="text-emerald-600 font-semibold">{formatDistance(therapist.distance)}</p>
                        )}
                      </div>
                    </div>

                    {/* Contact */}
                    {therapist.phone && (
                      <div className="flex items-center space-x-2 text-sm text-slate-700">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${therapist.phone}`} className="text-blue-600 hover:underline">
                          {therapist.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Cost Badge */}
                  <Badge
                    className={
                      therapist.cost === 'free'
                        ? 'bg-green-100 text-green-800 h-fit'
                        : 'bg-blue-100 text-blue-800 h-fit'
                    }
                  >
                    {therapist.cost === 'free' ? 'FREE' : 'LOW-COST'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredTherapists.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/90">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600">No {activeTab} services available at the moment.</p>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <Button
        onClick={loadTherapists}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Refresh Nearby Services'}
      </Button>

      {/* Privacy Notice */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
        <p>
          <strong>Privacy:</strong> Your location is only used to find nearby services and is never stored or shared.
        </p>
      </div>
    </div>
  )
}

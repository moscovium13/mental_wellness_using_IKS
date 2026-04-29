/**
 * Location-based therapy recommendation service
 * Handles geolocation and distance calculation for nearest therapist/facility sorting
 */

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface Therapist {
  id: string
  name: string
  specialty: string
  cost: 'free' | 'low-cost' | 'paid'
  latitude: number
  longitude: number
  address: string
  phone?: string
  distance?: number // Calculated distance in km
}

/**
 * Calculate distance between two points using Haversine formula (km)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Get user's current location
 */
export async function getUserLocation(): Promise<UserLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('[v0] Geolocation not supported')
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }
        console.log('[v0] User location obtained:', location)
        resolve(location)
      },
      (error) => {
        console.warn('[v0] Geolocation error:', error.message)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  })
}

/**
 * Sample therapists/facilities database
 * In production, this would come from a backend API
 */
const therapistDatabase: Therapist[] = [
  // Free services
  {
    id: 'free-1',
    name: 'Government Mental Health Clinic',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 40.7128,
    longitude: -74.006,
    address: '123 Health Street, City Center',
    phone: '1-800-MENTAL-1',
  },
  {
    id: 'free-2',
    name: 'Community Wellness Center',
    specialty: 'Anxiety & Depression',
    cost: 'free',
    latitude: 40.758,
    longitude: -73.9855,
    address: '456 Wellness Avenue, Uptown',
  },
  {
    id: 'free-3',
    name: 'Crisis Support Hotline Service',
    specialty: 'Crisis Intervention',
    cost: 'free',
    latitude: 40.6892,
    longitude: -74.0445,
    address: '789 Support Lane, Downtown',
    phone: '1-800-CRISIS-1',
  },

  // Low-cost services
  {
    id: 'low-1',
    name: 'Affordable Therapy Associates',
    specialty: 'Cognitive Behavioral Therapy',
    cost: 'low-cost',
    latitude: 40.7505,
    longitude: -73.9972,
    address: '321 Therapy Plaza, Midtown',
    phone: '212-555-0100',
  },
  {
    id: 'low-2',
    name: 'Community Counseling Services',
    specialty: 'Life Coaching & Counseling',
    cost: 'low-cost',
    latitude: 40.7614,
    longitude: -73.9776,
    address: '654 Counseling Drive, Upper East',
    phone: '212-555-0200',
  },
  {
    id: 'low-3',
    name: 'Yoga & Wellness Studio',
    specialty: 'Mind-Body Wellness',
    cost: 'low-cost',
    latitude: 40.7489,
    longitude: -73.968,
    address: '987 Yoga Street, SoHo',
    phone: '212-555-0300',
  },
  {
    id: 'low-4',
    name: 'Holistic Health Center',
    specialty: 'Ayurvedic & Holistic Care',
    cost: 'low-cost',
    latitude: 40.7282,
    longitude: -73.7949,
    address: '111 Holistic Path, Queens',
    phone: '718-555-0400',
  },
]

/**
 * Get therapists sorted by distance from user location
 * Only returns free and low-cost options
 */
export async function getNearestTherapists(): Promise<Therapist[]> {
  try {
    const userLocation = await getUserLocation()

    if (!userLocation) {
      console.warn('[v0] Could not get user location, returning therapists without distance sorting')
      return therapistDatabase.filter((t) => ['free', 'low-cost'].includes(t.cost))
    }

    // Calculate distance for each therapist
    const therapistsWithDistance = therapistDatabase
      .filter((t) => ['free', 'low-cost'].includes(t.cost))
      .map((therapist) => ({
        ...therapist,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          therapist.latitude,
          therapist.longitude,
        ),
      }))

    // Sort by distance (nearest first)
    const sorted = therapistsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0))

    console.log('[v0] Therapists sorted by distance:', sorted)
    return sorted
  } catch (error) {
    console.error('[v0] Error getting nearest therapists:', error)
    return therapistDatabase.filter((t) => ['free', 'low-cost'].includes(t.cost))
  }
}

/**
 * Filter therapists by cost tier
 */
export function filterTherapistsByCost(therapists: Therapist[], cost: 'free' | 'low-cost'): Therapist[] {
  return therapists.filter((t) => t.cost === cost)
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number | undefined): string {
  if (!distance) return 'Distance unknown'
  if (distance < 1) return `${Math.round(distance * 1000)}m away`
  return `${distance.toFixed(1)}km away`
}

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
 * Sample therapists/facilities database - Navi Mumbai & surrounding areas
 * In production, this would come from a backend API
 */
const therapistDatabase: Therapist[] = [
  // Free services - Navi Mumbai area
  {
    id: 'free-1',
    name: 'NMMC Civic Hospital Mental Health Clinic',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 19.033,
    longitude: 73.0157,
    address: 'NMMC Hospital, Nerul, Navi Mumbai',
    phone: '022-4089-5555',
  },
  {
    id: 'free-2',
    name: 'Manasi Psychological Services',
    specialty: 'Anxiety & Depression Counseling',
    cost: 'free',
    latitude: 19.0376,
    longitude: 73.0205,
    address: 'Sector 5, Nerul, Navi Mumbai',
  },
  {
    id: 'free-3',
    name: 'AASRA Crisis Support Center',
    specialty: 'Crisis Intervention & Support',
    cost: 'free',
    latitude: 19.0342,
    longitude: 73.0281,
    address: 'Sector 7, Nerul, Navi Mumbai',
    phone: '9820466726',
  },

  // Low-cost services - Navi Mumbai area
  {
    id: 'low-1',
    name: 'Serenity Minds Therapy Center',
    specialty: 'Cognitive Behavioral Therapy',
    cost: 'low-cost',
    latitude: 19.035,
    longitude: 73.0198,
    address: 'CBD Belapur, Navi Mumbai',
    phone: '022-2750-3456',
  },
  {
    id: 'low-2',
    name: 'Wellness Ayurveda & Counseling',
    specialty: 'Ayurvedic & Holistic Therapy',
    cost: 'low-cost',
    latitude: 19.0333,
    longitude: 73.0167,
    address: 'Nerul West, Navi Mumbai',
    phone: '022-2786-1234',
  },
  {
    id: 'low-3',
    name: 'Yoga & Mind Wellness Studio',
    specialty: 'Mind-Body Wellness & Yoga',
    cost: 'low-cost',
    latitude: 19.0365,
    longitude: 73.0225,
    address: 'Sector 8, Nerul, Navi Mumbai',
    phone: '022-2750-7890',
  },
  {
    id: 'low-4',
    name: 'Life Balance Counseling Services',
    specialty: 'Life Coaching & Stress Management',
    cost: 'low-cost',
    latitude: 19.0308,
    longitude: 73.0142,
    address: 'Nerul East, Navi Mumbai',
    phone: '022-2789-5555',
  },
  {
    id: 'low-5',
    name: 'Holistic Health Clinic',
    specialty: 'Traditional & Modern Therapy',
    cost: 'low-cost',
    latitude: 19.0385,
    longitude: 73.0245,
    address: 'Sector 10, Nerul, Navi Mumbai',
    phone: '022-2750-2222',
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

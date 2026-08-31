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
 * Comprehensive therapists/facilities database across major Indian cities
 * In production, this would come from a backend API with real therapist listings
 */
const therapistDatabase: Therapist[] = [
  // NAVI MUMBAI / NERUL
  {
    id: 'mm-free-1',
    name: 'NMMC Civic Hospital Mental Health Clinic',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 19.033,
    longitude: 73.0157,
    address: 'NMMC Hospital, Nerul, Navi Mumbai',
    phone: '022-4089-5555',
  },
  {
    id: 'mm-low-1',
    name: 'Serenity Minds Therapy Center',
    specialty: 'Cognitive Behavioral Therapy',
    cost: 'low-cost',
    latitude: 19.035,
    longitude: 73.0198,
    address: 'CBD Belapur, Navi Mumbai',
    phone: '022-2750-3456',
  },
  {
    id: 'mm-low-2',
    name: 'Wellness Ayurveda & Counseling',
    specialty: 'Ayurvedic & Holistic Therapy',
    cost: 'low-cost',
    latitude: 19.0333,
    longitude: 73.0167,
    address: 'Nerul West, Navi Mumbai',
    phone: '022-2786-1234',
  },

  // BANGALORE
  {
    id: 'blr-free-1',
    name: 'NIMHANS Bangalore Mental Health Clinic',
    specialty: 'Clinical Psychology & Psychiatry',
    cost: 'free',
    latitude: 13.0299,
    longitude: 77.5705,
    address: 'Hosur Road, Bangalore',
    phone: '080-2699-5555',
  },
  {
    id: 'blr-low-1',
    name: 'Mind Matters Counseling Bangalore',
    specialty: 'Individual & Family Therapy',
    cost: 'low-cost',
    latitude: 13.0827,
    longitude: 77.6064,
    address: 'Indiranagar, Bangalore',
    phone: '080-4242-5555',
  },
  {
    id: 'blr-low-2',
    name: 'Yoga & Meditation Studio Bangalore',
    specialty: 'Mind-Body Wellness',
    cost: 'low-cost',
    latitude: 13.0489,
    longitude: 77.5941,
    address: 'Koramangala, Bangalore',
    phone: '080-4141-3333',
  },

  // MUMBAI
  {
    id: 'mum-free-1',
    name: 'AIIMS Mumbai Mental Health Services',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 19.0127,
    longitude: 72.8192,
    address: 'Aarey Colony, Mumbai',
    phone: '022-2159-5555',
  },
  {
    id: 'mum-low-1',
    name: 'Therapists Mumbai Network',
    specialty: 'CBT & Counseling',
    cost: 'low-cost',
    latitude: 19.0176,
    longitude: 72.8479,
    address: 'Bandra, Mumbai',
    phone: '022-2644-3333',
  },

  // DELHI NCR
  {
    id: 'del-free-1',
    name: 'AIIMS Delhi Mental Health Center',
    specialty: 'Comprehensive Mental Health',
    cost: 'free',
    latitude: 28.5684,
    longitude: 77.2188,
    address: 'Ansari Nagar, New Delhi',
    phone: '011-2658-8888',
  },
  {
    id: 'del-low-1',
    name: 'Delhi Counseling Services',
    specialty: 'Therapy & Coaching',
    cost: 'low-cost',
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Connaught Place, Delhi',
    phone: '011-4141-7777',
  },
  {
    id: 'gurgaon-low-1',
    name: 'Gurugram Wellness Center',
    specialty: 'Corporate Stress Management',
    cost: 'low-cost',
    latitude: 28.4595,
    longitude: 77.0266,
    address: 'Sector 31, Gurugram',
    phone: '0124-4000-5555',
  },

  // HYDERABAD
  {
    id: 'hyd-free-1',
    name: 'Osmania Medical College Mental Health',
    specialty: 'Psychiatry & Psychology',
    cost: 'free',
    latitude: 17.3850,
    longitude: 78.4867,
    address: 'Hyderabad',
    phone: '040-2343-6666',
  },
  {
    id: 'hyd-low-1',
    name: 'Hyderabad Counseling Center',
    specialty: 'Therapy & Support',
    cost: 'low-cost',
    latitude: 17.3850,
    longitude: 78.4867,
    address: 'HITEC City, Hyderabad',
    phone: '040-4141-4141',
  },

  // CHENNAI
  {
    id: 'chn-free-1',
    name: 'AIIMS Chennai Mental Health Clinic',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 12.9716,
    longitude: 79.8789,
    address: 'Taramani, Chennai',
    phone: '044-2293-4444',
  },
  {
    id: 'chn-low-1',
    name: 'Chennai Therapy Associates',
    specialty: 'Individual & Group Therapy',
    cost: 'low-cost',
    latitude: 13.0499,
    longitude: 80.2624,
    address: 'Anna Nagar, Chennai',
    phone: '044-4200-5555',
  },

  // PUNE
  {
    id: 'pune-free-1',
    name: 'Pune Medical College Mental Health',
    specialty: 'Clinical & Counseling',
    cost: 'free',
    latitude: 18.5204,
    longitude: 73.8567,
    address: 'Dhankawadi, Pune',
    phone: '020-2642-6666',
  },
  {
    id: 'pune-low-1',
    name: 'Pune Wellness Center',
    specialty: 'Holistic Therapy',
    cost: 'low-cost',
    latitude: 18.5401,
    longitude: 73.8819,
    address: 'Koregaon Park, Pune',
    phone: '020-6555-3333',
  },

  // KOLKATA
  {
    id: 'kkl-free-1',
    name: 'AIIMS Kolkata Mental Health',
    specialty: 'Psychiatry & Psychology',
    cost: 'free',
    latitude: 22.5726,
    longitude: 88.3639,
    address: 'Newtown, Kolkata',
    phone: '033-2331-5555',
  },
  {
    id: 'kkl-low-1',
    name: 'Kolkata Counseling Services',
    specialty: 'Therapy & Wellness',
    cost: 'low-cost',
    latitude: 22.5726,
    longitude: 88.3639,
    address: 'South Kolkata',
    phone: '033-4000-4444',
  },

  // AHMEDABAD
  {
    id: 'ahd-free-1',
    name: 'Civil Hospital Mental Health Wing',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 23.1815,
    longitude: 72.6409,
    address: 'Ahmedabad',
    phone: '079-2656-4444',
  },
  {
    id: 'ahd-low-1',
    name: 'Ahmedabad Therapy Center',
    specialty: 'Counseling & Therapy',
    cost: 'low-cost',
    latitude: 23.1815,
    longitude: 72.6409,
    address: 'Thaltej, Ahmedabad',
    phone: '079-2900-5555',
  },

  // JAIPUR
  {
    id: 'jpr-free-1',
    name: 'Jaipur Medical College Mental Health',
    specialty: 'Psychiatric Services',
    cost: 'free',
    latitude: 26.8124,
    longitude: 75.7873,
    address: 'Jaipur',
    phone: '0141-2222-6666',
  },
  {
    id: 'jpr-low-1',
    name: 'Jaipur Wellness Clinic',
    specialty: 'Therapy & Life Coaching',
    cost: 'low-cost',
    latitude: 26.8124,
    longitude: 75.7873,
    address: 'C-Scheme, Jaipur',
    phone: '0141-4000-5555',
  },

  // LUCKNOW
  {
    id: 'luck-free-1',
    name: 'King George Medical College Mental Health',
    specialty: 'General Mental Health',
    cost: 'free',
    latitude: 26.8467,
    longitude: 80.9462,
    address: 'Lucknow',
    phone: '0522-2257-6666',
  },
  {
    id: 'luck-low-1',
    name: 'Lucknow Counseling Services',
    specialty: 'Therapy & Wellness',
    cost: 'low-cost',
    latitude: 26.8467,
    longitude: 80.9462,
    address: 'Alambagh, Lucknow',
    phone: '0522-4000-4444',
  },

  // KOCHI
  {
    id: 'kch-free-1',
    name: 'Cochin Medical College Mental Health',
    specialty: 'Psychiatry Services',
    cost: 'free',
    latitude: 9.9312,
    longitude: 76.2673,
    address: 'Kochi',
    phone: '0484-2222-5555',
  },
  {
    id: 'kch-low-1',
    name: 'Kochi Wellness Center',
    specialty: 'Holistic Therapy',
    cost: 'low-cost',
    latitude: 9.9312,
    longitude: 76.2673,
    address: 'Fort Kochi, Kochi',
    phone: '0484-4000-5555',
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

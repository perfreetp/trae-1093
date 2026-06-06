export interface ParkingLot {
  id: string
  name: string
  address: string
  distance: number
  totalSpaces: number
  availableSpaces: number
  pricePerHour: number
  pricePerDay?: number
  rating: number
  tags: string[]
  image: string
  latitude: number
  longitude: number
  isFavorite: boolean
  openTime: string
  features: string[]
}

export interface ParkingFilter {
  keyword?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'distance' | 'price' | 'available'
  onlyAvailable?: boolean
}

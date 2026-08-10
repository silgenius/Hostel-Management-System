export interface Room {
  id: string
  room_number: string
  block: string
  floor: number
  capacity: number
  created_at: string
  occupancy?: number
}
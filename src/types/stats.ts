interface BaseAccount {
  uid: number
  nickname: string
  level: number
  server: string
  server_name: string
  game_biz: string
}

interface Stats {
  achievements: number
  days_active: number
  characters: number
  spiral_abyss: string
  anemoculi: number
  geoculi: number
  electroculi: number
  dendroculi: number
  hydroculi: number
  pyroculi: number
  lunoculi: number
  common_chests: number
  exquisite_chests: number
  precious_chests: number
  luxurious_chests: number
  unlocked_waypoints: number
  unlocked_domains: number
}

export interface Account extends BaseAccount {
  stats: Stats
}
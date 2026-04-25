interface BaseAccount {
  uid: number
  nickname: string
  level: number
  server: string
  server_name: string
  game_biz: string
}

interface StygianStats {
  difficulty: number
  has_data: boolean
  name: string
  unlocked: boolean
}

interface TheaterStats {
  has_data: boolean
  has_detail_data: boolean
  max_act: number
  unlocked: boolean
}

interface Stats {
  account_uid: number
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
  remarkable_chests: number
  unlocked_waypoints: number
  unlocked_domains: number
  max_friendship_characters?: number
  stygian?: StygianStats
  theater?: TheaterStats
}

export interface Account extends BaseAccount {
  stats: Stats
}

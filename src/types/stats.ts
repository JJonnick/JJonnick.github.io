interface BaseAccount {
  uid: number
  nickname: string
  level: number
  server: string
  server_name: string
  game_biz: string
}

interface Stats {
  account_uid?: string
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
  stygian?: number
  theater?: number
}

export interface Account extends BaseAccount {
  stats: Stats
}

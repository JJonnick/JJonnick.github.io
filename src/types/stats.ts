export interface Stats {
    nickname: string
    level: number
    achievements: number
    days_active: number
    characters: number
    spiral_abyss: string
    anemoculi: number
    geoculi: number
    electroculi: number
    dendroculi: number
    hydroculi: number
    common_chests: number
    exquisite_chests: number
    precious_chests: number
    luxurious_chests: number
    unlocked_waypoints: number
    unlocked_domains: number
    [key: string]: number | string
  }
  
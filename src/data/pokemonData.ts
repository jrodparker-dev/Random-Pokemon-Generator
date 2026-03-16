export interface GenderRatio {
  male: number
  female: number
}

export interface PokemonForm {
  name?: string
  types?: string[]
  spriteSuffix?: string
  isMega?: boolean
  isGigantamax?: boolean
}

export interface Pokemon {
  id: number
  name: string
  types: string[]
  isNfe?: boolean
  evolutionCount?: 0 | 1 | 2
  isSubLegendary?: boolean
  isLegendary?: boolean
  isMythical?: boolean
  isParadox?: boolean
  isUltraBeast?: boolean
  forms?: PokemonForm[]
  genderRatio?: GenderRatio | 'unknown'
}

export const REGIONS = [
  'kanto',
  'stadium_rentals',
  'johto',
  'stadium_2_rentals',
  'hoenn',
  'sinnoh',
  'sinnoh_pt',
  'unova',
  'unova_b2w2',
  'kalos',
  'alola',
  'alola_usum',
  'galar',
  'hisui',
  'paldea',
  'kitakami',
  'blueberry',
  'lumiose',
] as const

export const TYPE_OPTIONS = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
] as const

const regionCache = new Map<string, Pokemon[]>()

export async function loadPokemonByRegion(region: string): Promise<Pokemon[]> {
  if (regionCache.has(region)) {
    return regionCache.get(region) as Pokemon[]
  }

  const response = await fetch(`dex/${region}.json`)
  if (!response.ok) {
    throw new Error(`Could not load dex data for region: ${region}`)
  }

  const pokemon = (await response.json()) as Pokemon[]
  regionCache.set(region, pokemon)
  return pokemon
}

export async function loadPokemonFromRegions(regions: string[]): Promise<Pokemon[]> {
  const selected = regions.length ? regions : ['all']
  const regionResults = await Promise.all(selected.map(loadPokemonByRegion))

  if (regionResults.length === 1) {
    return regionResults[0]
  }

  const merged = new Map<number, Pokemon>()
  regionResults.flat().forEach((pokemon) => {
    merged.set(pokemon.id, pokemon)
  })
  return [...merged.values()]
}

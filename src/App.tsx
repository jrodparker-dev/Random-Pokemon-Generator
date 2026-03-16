import { useMemo, useState } from 'react'
import {
  REGIONS,
  TYPE_OPTIONS,
  type Pokemon,
  loadPokemonFromRegions,
} from './data/pokemonData'
import './styles.css'

interface GeneratedPokemon {
  id: number
  name: string
  spritePath: string
  shinySpritePath: string
  shiny: boolean
  types: string[]
}

const regionLabels: Record<string, string> = {
  kanto: 'Kanto',
  stadium_rentals: 'Stadium Rentals',
  johto: 'Johto',
  stadium_2_rentals: 'Stadium 2 Rentals',
  hoenn: 'Hoenn',
  sinnoh: 'Sinnoh',
  sinnoh_pt: 'Sinnoh (Platinum)',
  unova: 'Unova',
  unova_b2w2: 'Unova (B2W2)',
  kalos: 'Kalos',
  alola: 'Alola',
  alola_usum: 'Alola (USUM)',
  galar: 'Galar',
  hisui: 'Hisui',
  paldea: 'Paldea',
  kitakami: 'Kitakami',
  blueberry: 'Blueberry',
  lumiose: 'Lumiose',
}

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function sampleWithoutReplacement<T>(arr: T[], n: number): T[] {
  const pool = [...arr]
  const out: T[] = []
  const count = Math.min(n, pool.length)

  for (let i = 0; i < count; i += 1) {
    const index = Math.floor(Math.random() * pool.length)
    out.push(pool.splice(index, 1)[0])
  }

  return out
}

function matchesTypes(pokemon: Pokemon, selectedTypes: string[]): boolean {
  if (selectedTypes.length === 0) return true
  return pokemon.types.some((t) => selectedTypes.includes(t))
}

export default function App() {
  const [count, setCount] = useState(6)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [includeLegendaries, setIncludeLegendaries] = useState(true)
  const [includeMythicals, setIncludeMythicals] = useState(true)
  const [includeSubLegendaries, setIncludeSubLegendaries] = useState(true)
  const [results, setResults] = useState<GeneratedPokemon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedRegionsLabel = useMemo(() => {
    if (selectedRegions.length === 0) return 'All regions'
    return `${selectedRegions.length} region(s)`
  }, [selectedRegions])

  const selectedTypesLabel = useMemo(() => {
    if (selectedTypes.length === 0) return 'All types'
    return `${selectedTypes.length} type(s)`
  }, [selectedTypes])

  async function generate() {
    setLoading(true)
    setError(null)

    try {
      const allPokemon = await loadPokemonFromRegions(selectedRegions)

      const eligible = allPokemon.filter((pokemon) => {
        if (!includeLegendaries && pokemon.isLegendary) return false
        if (!includeMythicals && pokemon.isMythical) return false
        if (!includeSubLegendaries && pokemon.isSubLegendary) return false
        return matchesTypes(pokemon, selectedTypes)
      })

      const generated = sampleWithoutReplacement(eligible, count).map((pokemon) => {
        const slug = makeSlug(pokemon.name)
        const shiny = Math.floor(Math.random() * 65536) < 16

        return {
          id: pokemon.id,
          name: pokemon.name,
          spritePath: `sprites/normal/${slug}.webp`,
          shinySpritePath: `sprites/shiny/${slug}.webp`,
          shiny,
          types: pokemon.types,
        }
      })

      setResults(generated)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function toggleItem(value: string, selected: string[], setter: (next: string[]) => void) {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    )
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>Random Pokémon Generator</h1>
        <p>Vite + React edition, ready for GitHub Pages (`/docs`) hosting.</p>
      </header>

      <section className="panel controls">
        <h2>Controls</h2>
        <div className="row">
          <label>
            Number to generate
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <details>
          <summary>{selectedRegionsLabel}</summary>
          <div className="chips">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                className={selectedRegions.includes(region) ? 'chip active' : 'chip'}
                onClick={() => toggleItem(region, selectedRegions, setSelectedRegions)}
              >
                {regionLabels[region]}
              </button>
            ))}
          </div>
        </details>

        <details>
          <summary>{selectedTypesLabel}</summary>
          <div className="chips">
            {TYPE_OPTIONS.map((type) => (
              <button
                key={type}
                type="button"
                className={selectedTypes.includes(type) ? 'chip active' : 'chip'}
                onClick={() => toggleItem(type, selectedTypes, setSelectedTypes)}
              >
                {type}
              </button>
            ))}
          </div>
        </details>

        <div className="toggles">
          <label>
            <input
              type="checkbox"
              checked={includeSubLegendaries}
              onChange={(e) => setIncludeSubLegendaries(e.target.checked)}
            />
            Sub-legendaries
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeLegendaries}
              onChange={(e) => setIncludeLegendaries(e.target.checked)}
            />
            Legendaries
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeMythicals}
              onChange={(e) => setIncludeMythicals(e.target.checked)}
            />
            Mythicals
          </label>
        </div>

        <button type="button" className="generate-btn" onClick={generate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate Pokémon'}
        </button>
      </section>

      <section className="panel results">
        <h2>Results</h2>
        {error && <p className="error">{error}</p>}
        {!error && results.length === 0 && <p>Run a generation to see Pokémon here.</p>}

        <ul className="results-grid">
          {results.map((pokemon) => (
            <li key={`${pokemon.id}-${pokemon.name}`}>
              <img
                src={pokemon.shiny ? pokemon.shinySpritePath : pokemon.spritePath}
                alt={pokemon.name}
                loading="lazy"
              />
              <h3>
                {pokemon.name} {pokemon.shiny ? '✦' : ''}
              </h3>
              <p>{pokemon.types.join(' / ')}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

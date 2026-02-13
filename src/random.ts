/** Called when the Generate button is clicked. */
async function generateRandom() {
	markLoading(true);

	const options = getOptionsFromForm();
	persistOptions(options);

	try {
		const eligiblePokemon = await getEligiblePokemon(options);
		const generatedPokemon = await chooseRandom(eligiblePokemon, options);
		addToHistory(generatedPokemon);
		displayPokemon(generatedPokemon);
	} catch (error) {
		console.error(error);
		displayPokemon(null);
	}
	markLoading(false);
}

function onPageLoad() {
	loadOptions();
	toggleHistoryVisibility();
	addFormChangeListeners();
	displayYearsInFooter();
}
document.addEventListener("DOMContentLoaded", onPageLoad);

function displayPokemon(pokemon: GeneratedPokemon[]) {
	const resultsContainer = document.getElementById("results");
	if (!pokemon) {
		resultsContainer.innerHTML = "An error occurred while generating Pok&eacute;mon.";
	} else if (pokemon.length == 0) {
		resultsContainer.innerHTML = "No matching Pok&eacute;mon found.";
	} else {
		resultsContainer.innerHTML = toHtml(pokemon);
		// Bind click-to-reveal for mystery mode.
		bindMysteryReveal();
	}
}

// Cache the results of getEligiblePokemon by options.
let cachedOptionsJson: string;
let cachedEligiblePokemon: Pokemon[];

async function getEligiblePokemon(options: Options): Promise<Pokemon[]> {
	const optionsJson = JSON.stringify(options);

	if (cachedOptionsJson == optionsJson) {
		return Promise.resolve(cachedEligiblePokemon);
	} else {
		const eligiblePokemon = await filterByOptions(await getPokemonInRegions(options.regions), options);
		cachedOptionsJson = optionsJson;
		cachedEligiblePokemon = eligiblePokemon;
		return eligiblePokemon;
	}
}

// --- Showdown data (stats/abilities) ---------------------------------------

type ShowdownDexEntry = {
	name?: string;
	spriteid?: string;
	baseStats?: {hp: number, atk: number, def: number, spa: number, spd: number, spe: number};
	abilities?: {[slot: string]: string};
};

let showdownDexCache: Promise<Map<string, ShowdownDexEntry>> | null = null;

async function getShowdownDex(): Promise<Map<string, ShowdownDexEntry>> {
	if (showdownDexCache) return showdownDexCache;
	showdownDexCache = (async () => {
		const res = await fetch('https://play.pokemonshowdown.com/data/pokedex.json', {cache: 'force-cache'} as any);
		if (!res.ok) throw new Error('Failed to fetch Pokémon Showdown dex data.');
		const json = await res.json();
		const map = new Map<string, ShowdownDexEntry>();
		for (const [key, entry] of Object.entries(json)) {
			const e = entry as ShowdownDexEntry;
			// Index by pokedex key.
			map.set(key.toLowerCase(), e);
			// Index by spriteid if present.
			if (e.spriteid) map.set(String(e.spriteid).toLowerCase(), e);
			// Index by normalized name for fallback.
			if (e.name) map.set(normalizeForLookup(String(e.name)), e);
		}
		return map;
	})();
	return showdownDexCache;
}

function normalizeForLookup(name: string): string {
	return name
		.toLowerCase()
		.replaceAll('é', 'e')
		.replaceAll('♀', 'f')
		.replaceAll('♂', 'm')
		.replaceAll(/[^a-z0-9]+/g, '');
}

async function getExtrasForSpriteKey(spriteKey: string, displayName?: string): Promise<ShowdownDexEntry | null> {
	const dex = await getShowdownDex();
	const candidates = [
		spriteKey,
		spriteKey.replaceAll('-', ''),
		spriteKey.replaceAll('-gigantamax', 'gmax'),
		spriteKey.replaceAll('-mega-x', 'megax'),
		spriteKey.replaceAll('-mega-y', 'megay'),
		(displayName ? normalizeForLookup(displayName) : ''),
	].filter(Boolean);
	for (const c of candidates) {
		const hit = dex.get(String(c).toLowerCase());
		if (hit) return hit;
	}
	return null;
}

async function getPokemonInRegions(regions: string[]): Promise<Pokemon[]> {
	if (regions.length == regionCheckboxes.length || regions.length == 0) {
		regions = ["all"];
	}

	const responses = await Promise.all(
		regions.map(region => fetch("dex/" + region + ".json"))
	);
	const pokemonById = new Map<number, Pokemon>();
	for (const response of responses) {
		if (!response.ok) {
			console.error(response);
			throw Error("Failed to get eligible Pokémon.");
		}
		const pokemonInRegion = await response.json();

		// No need to merge anything if only one region was selected.
		if (responses.length == 1) {
			return pokemonInRegion;
		}

		// Merge so that an older region's version of a Pokémon is overwritten by a newer region's.
		for (const pokemon of pokemonInRegion) {
			pokemonById.set(pokemon.id, mergePokemon(pokemon, pokemonById.get(pokemon.id)));
		}
	}

	return Array.from(pokemonById.values());
}

async function filterByOptions(pokemonInRegions: Pokemon[], options: Options): Promise<Pokemon[]> {
	const evolutionCounts = new Set(options.evolutionCounts);
	const types = new Set(options.types);
	const generations = new Set(options.generations);

	const needsShowdown =
		options.attacker !== 'any' ||
		options.minHp > 0 || options.minAtk > 0 || options.minDef > 0 || options.minSpA > 0 || options.minSpD > 0 || options.minSpe > 0 ||
		options.abilities;

	// Warm showdown cache if needed so filtering doesn't spam requests.
	if (needsShowdown) {
		try { await getShowdownDex(); } catch (e) { console.warn(e); }
	}

	const out: Pokemon[] = [];
	for (const pokemon of pokemonInRegions) {
		// Generations filter (based on National Dex number).
		if (generations.size > 0 && generations.size != 9) {
			const gen = getGenerationFromDexNum(pokemon.id);
			if (!generations.has(gen)) continue;
		}

		// Legends-only filter.
		if (options.legendsOnly) {
			const isLegendFamily = !!(pokemon.isSubLegendary || pokemon.isLegendary || pokemon.isMythical || pokemon.isParadox || pokemon.isUltraBeast);
			if (!isLegendFamily) continue;
		}

		// Legendary and evolution status are independent of form, so check these before checking forms.
		if (!options.sublegendaries && pokemon.isSubLegendary) continue;
		if (!options.legendaries && pokemon.isLegendary) continue;
		if (!options.mythicals && pokemon.isMythical) continue;
		if (!options.paradoxes && pokemon.isParadox) continue;
		if (!options.ultraBeasts && pokemon.isUltraBeast) continue;
		if (options.nfes || options.fullyEvolved) {
			if (!options.nfes && pokemon.isNfe) continue;
			if (!options.fullyEvolved && !pokemon.isNfe) continue;
		}
		if (evolutionCounts.size > 0) {
			const evolutionCount = pokemon.evolutionCount ?? 0;
			if (!evolutionCounts.has(evolutionCount)) continue;
		}

		if (options.forms && pokemon.forms) {
			const keptForms: Form[] = [];
			for (const form of pokemon.forms) {
				if (!options.megas && form.isMega) continue;
				if (!options.gigantamaxes && form.isGigantamax) continue;
				if (!filterByType(pokemon, form, types)) continue;
				if (!(await passesStatsAndAttacker(pokemon, form, options))) continue;
				keptForms.push(form);
			}
			if (keptForms.length === 0) continue;
			// Mutate the object (consistent with original design).
			pokemon.forms = keptForms;
			out.push(pokemon);
		} else {
			if (!filterByType(pokemon, null, types)) continue;
			if (!(await passesStatsAndAttacker(pokemon, null, options))) continue;
			out.push(pokemon);
		}
	}
	return out;
}

function getGenerationFromDexNum(num: number): number {
	if (num <= 151) return 1;
	if (num <= 251) return 2;
	if (num <= 386) return 3;
	if (num <= 493) return 4;
	if (num <= 649) return 5;
	if (num <= 721) return 6;
	if (num <= 809) return 7;
	if (num <= 905) return 8;
	return 9;
}

function filterByType(pokemon: Pokemon, form: Form | null, types: Set<string>): boolean {
	return types.size === 0 || (form?.types ?? pokemon.types).some(type => types.has(type));
}

async function passesStatsAndAttacker(pokemon: Pokemon, form: Form | null, options: Options): Promise<boolean> {
	const needs = options.attacker !== 'any'
		|| options.minHp > 0 || options.minAtk > 0 || options.minDef > 0 || options.minSpA > 0 || options.minSpD > 0 || options.minSpe > 0;
	if (!needs) return true;

	let spriteKey = normalizeSpriteKey(pokemon.name);
	if (form?.spriteSuffix) spriteKey += '-' + form.spriteSuffix;
	const displayName = getName(pokemon, form ?? undefined);
	const entry = await getExtrasForSpriteKey(spriteKey, displayName);
	const s = entry?.baseStats;
	if (!s) return false;

	if (s.hp < options.minHp) return false;
	if (s.atk < options.minAtk) return false;
	if (s.def < options.minDef) return false;
	if (s.spa < options.minSpA) return false;
	if (s.spd < options.minSpD) return false;
	if (s.spe < options.minSpe) return false;

	if (options.attacker === 'special') {
		if (!(s.spa > s.atk)) return false;
	}
	if (options.attacker === 'physical') {
		if (!(s.atk >= s.spa)) return false;
	}
	return true;
}

function normalizeSpriteKey(name: string): string {
	return name
		.toLowerCase()
		.replaceAll('é', 'e')
		.replaceAll('♀', 'f')
		.replaceAll('♂', 'm')
		.replaceAll(/['.:% -]/g, '');
}

/** Chooses N random Pokémon from the array of eligibles without replacement. */
async function chooseRandom(eligiblePokemon: Pokemon[], options: Options): Promise<GeneratedPokemon[]> {
	const generated = [];

	// Deep copy so that we can modify the array as needed.
	eligiblePokemon = JSON.parse(JSON.stringify(eligiblePokemon));

	while (eligiblePokemon.length > 0 && generated.length < options.n) {
		const pokemon: Pokemon = removeRandomElement(eligiblePokemon);
		let form = null;

		if (options.forms && pokemon.forms) {
			form = removeRandomElement(pokemon.forms);

			// If we generated a mega, we can't choose any more.
			if (form.isMega) {
				eligiblePokemon = removeMegas(eligiblePokemon);
			}
			if (form.isGigantamax) {
				eligiblePokemon = removeGigantamaxes(eligiblePokemon);
			}
		}

		const gp = GeneratedPokemon.generate(pokemon, form, options);
		// Attach ability/stats-dependent generation.
		await gp.populateFromShowdown(options);
		generated.push(gp);
	}

	// Megas are more likely to appear at the start of the array,
	// so we shuffle for good measure.
	const shuffled = shuffle(generated);
	if (options.fusion && shuffled.length > 0) {
		const fusion = GeneratedPokemon.generateFusion(shuffled, options);
		shuffled.push(fusion);
	}
	return shuffled;
}

function bindMysteryReveal() {
	const covers = Array.from(document.querySelectorAll('.mysteryCover')) as HTMLElement[];
	if (covers.length === 0) return;
	covers.forEach(cover => {
		cover.addEventListener('click', () => {
			const li = cover.closest('li');
			if (!li) return;
			li.classList.add('revealed');
			cover.remove();
		});
	});
}

/** Filters megas from the array. Doesn't mutate the original array. */
function removeMegas(pokemonArray: Pokemon[]): Pokemon[] {
	return pokemonArray.filter((pokemon: Pokemon) => {
		if (pokemon.forms) {
			pokemon.forms = pokemon.forms.filter(form => !form.isMega);
			return pokemon.forms.length > 0;
		} else {
			return true; // always keep if no forms
		}
	});
}

/** Filters Gigantamax forms from the array. Doesn't mutate the original array. */
function removeGigantamaxes(pokemonArray: Pokemon[]): Pokemon[] {
	return pokemonArray.filter((pokemon: Pokemon) => {
		if (pokemon.forms) {
			pokemon.forms = pokemon.forms.filter(form => !form.isGigantamax);
			return pokemon.forms.length > 0;
		} else {
			return true; // always keep if no forms
		}
	});
}

/** Converts a JSON array of Pokémon into an HTML ordered list. */
function toHtml(pokemon: GeneratedPokemon[]) {
	return `<ol>${pokemon.map(p => p.toHtml()).join("")}</ol>`;
}
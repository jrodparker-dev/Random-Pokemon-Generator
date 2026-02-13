var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var HISTORY_SIZE = 64;
var STORAGE_SHINIES_KEY = "shinies";
var latestPokemon = [];
var displayedIndex = -1;
function addToHistory(pokemon) {
    if (!pokemon || pokemon.length == 0) {
        return;
    }
    latestPokemon.unshift(pokemon);
    while (latestPokemon.length > HISTORY_SIZE) {
        latestPokemon.pop();
    }
    var shinies = getShinies();
    shinies.unshift.apply(shinies, pokemon.filter(function (p) { return p.shiny; }));
    window.localStorage.setItem(STORAGE_SHINIES_KEY, JSON.stringify(shinies));
    displayedIndex = 0;
    toggleHistoryVisibility(shinies);
}
function toggleHistoryVisibility(shinies) {
    document.getElementById("previous").classList.toggle("hidden", displayedIndex >= latestPokemon.length - 1);
    document.getElementById("next").classList.toggle("hidden", displayedIndex <= 0);
    shinies = shinies !== null && shinies !== void 0 ? shinies : getShinies();
    document.getElementById("shiny-count").innerHTML = String(shinies.length);
    document.getElementById("shinies").innerHTML = "<ol>"
        + shinies.map(function (p) { return p.toHtmlForShinyHistory(); }).join(" ")
        + "</ol>";
    document.getElementById("shiny-toggler").classList.toggle("invisible", shinies.length == 0);
}
function displayPrevious() {
    displayHistoryAtIndex(displayedIndex + 1);
}
function displayNext() {
    displayHistoryAtIndex(displayedIndex - 1);
}
function displayHistoryAtIndex(index) {
    index = Math.max(0, Math.min(index, latestPokemon.length - 1));
    if (index != displayedIndex) {
        displayedIndex = index;
        displayPokemon(latestPokemon[index]);
        toggleHistoryVisibility();
    }
}
function getShinies() {
    var shinies = JSON.parse(window.localStorage.getItem(STORAGE_SHINIES_KEY), dateReviver);
    if (!Array.isArray(shinies)) {
        return [];
    }
    return shinies.map(function (shiny) { return GeneratedPokemon.fromJson(shiny); });
}
function dateReviver(key, value) {
    if (key == "date" && typeof value == "string") {
        return new Date(value);
    }
    else {
        return value;
    }
}
function toggleShinyDisplay() {
    var isInvisible = document.getElementById("shiny-container").classList.toggle("invisible");
    updateShinyToggler(!isInvisible);
}
function updateShinyToggler(shiniesVisible) {
    var button = document.getElementById("shiny-toggler");
    button.classList.toggle("is-hiding", !shiniesVisible);
    button.classList.toggle("is-showing", shiniesVisible);
}
function clearShinies() {
    if (window.confirm("Are you sure you want to clear your shiny Pokémon?")) {
        window.localStorage.removeItem(STORAGE_SHINIES_KEY);
        document.getElementById("shiny-container").classList.add("invisible");
        toggleHistoryVisibility([]);
        updateShinyToggler(false);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var touchStartX = 0;
    var touchStartY = 0;
    var resultsElement = document.getElementById("results");
    resultsElement.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });
    resultsElement.addEventListener("touchend", function (e) {
        var changeX = e.changedTouches[0].screenX - touchStartX;
        var changeY = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(changeX) > 100 && Math.abs(changeX) > 2 * Math.abs(changeY)) {
            if (changeX > 0) {
                displayPrevious();
            }
            else {
                displayNext();
            }
        }
    });
});
var STORAGE_OPTIONS_KEY = "options";
var numberDropdown = document.getElementById("n");
var regionsDropdown = document.getElementById("regions");
var allRegionsCheckbox = regionsDropdown.querySelector("input[value='all']");
var regionCheckboxes = Array.from(regionsDropdown.querySelectorAll("input:not([value='all'])"));
var typesDropdown = document.getElementById("types");
var allTypesCheckbox = typesDropdown.querySelector("input[value='all']");
var typeCheckboxes = Array.from(typesDropdown.querySelectorAll("input:not([value='all'])"));
var sublegendariesCheckbox = document.getElementById("sublegendaries");
var legendariesCheckbox = document.getElementById("legendaries");
var mythicalsCheckbox = document.getElementById("mythicals");
var paradoxCheckbox = document.getElementById("paradox");
var ultraBeastCheckbox = document.getElementById("ultraBeast");
var nfesCheckbox = document.getElementById("nfes");
var fullyEvolvedCheckbox = document.getElementById("fullyEvolved");
var unevolvedCheckbox = document.getElementById("unevolved");
var evolvedOnceCheckbox = document.getElementById("evolvedOnce");
var evolvedTwiceCheckbox = document.getElementById("evolvedTwice");
var evolutionCountCheckboxes = [unevolvedCheckbox, evolvedOnceCheckbox, evolvedTwiceCheckbox];
var displayDropdown = document.getElementById("display");
var naturesCheckbox = document.getElementById("natures");
var gendersCheckbox = document.getElementById("genders");
var generationsDropdown = document.getElementById("generations");
var generationCheckboxes = Array.from(generationsDropdown.querySelectorAll("input[name='generations']"));
var legendsOnlyCheckbox = document.getElementById("legendsOnly");
var abilitiesCheckbox = document.getElementById("abilities");
var buffsCheckbox = document.getElementById("buffs");
var mysteryCheckbox = document.getElementById("mystery");
var fusionCheckbox = document.getElementById("fusion");
var shinyOddsDropdown = document.getElementById("shinyOdds");
var attackerDropdown = document.getElementById("attacker");
var minHpInput = document.getElementById("minHp");
var minAtkInput = document.getElementById("minAtk");
var minDefInput = document.getElementById("minDef");
var minSpAInput = document.getElementById("minSpA");
var minSpDInput = document.getElementById("minSpD");
var minSpeInput = document.getElementById("minSpe");
var formsDropdown = document.getElementById("formsDropdown");
var formsCheckbox = document.getElementById("forms");
var megasCheckbox = document.getElementById("megas");
var gigantamaxesCheckbox = document.getElementById("gigantamaxes");
function getOptionsFromForm() {
    return {
        n: parseInt(numberDropdown.value),
        regions: getSelectedRegions(),
        types: getSelectedTypes(),
        sublegendaries: sublegendariesCheckbox.checked,
        legendaries: legendariesCheckbox.checked,
        mythicals: mythicalsCheckbox.checked,
        paradoxes: paradoxCheckbox.checked,
        ultraBeasts: ultraBeastCheckbox.checked,
        evolutionCounts: getEvolutionCounts(),
        nfes: nfesCheckbox.checked,
        fullyEvolved: fullyEvolvedCheckbox.checked,
        names: displayDropdown.value != "sprites",
        sprites: displayDropdown.value != "names",
        natures: naturesCheckbox.checked,
        genders: gendersCheckbox.checked,
        forms: formsCheckbox.checked,
        megas: megasCheckbox.checked,
        gigantamaxes: gigantamaxesCheckbox.checked,
        generations: getSelectedGenerations(),
        legendsOnly: legendsOnlyCheckbox.checked,
        abilities: abilitiesCheckbox.checked,
        buffs: buffsCheckbox.checked,
        mystery: mysteryCheckbox.checked,
        fusion: fusionCheckbox.checked,
        shinyOdds: parseInt(shinyOddsDropdown.value),
        attacker: attackerDropdown.value,
        minHp: parseInt(minHpInput.value || "0"),
        minAtk: parseInt(minAtkInput.value || "0"),
        minDef: parseInt(minDefInput.value || "0"),
        minSpA: parseInt(minSpAInput.value || "0"),
        minSpD: parseInt(minSpDInput.value || "0"),
        minSpe: parseInt(minSpeInput.value || "0"),
    };
}
function getSelectedGenerations() {
    return generationCheckboxes
        .filter(function (checkbox) { return checkbox.checked; })
        .map(function (checkbox) { return parseInt(checkbox.value); });
}
function getEvolutionCounts() {
    return evolutionCountCheckboxes
        .filter(function (checkbox) { return checkbox.checked; })
        .map(function (checkbox) { return parseInt(checkbox.value); });
}
function getSelectedRegions() {
    return regionCheckboxes
        .filter(function (checkbox) { return checkbox.checked; })
        .map(function (checkbox) { return checkbox.value; });
}
function getSelectedTypes() {
    return typeCheckboxes
        .filter(function (checkbox) { return checkbox.checked; })
        .map(function (checkbox) { return checkbox.value; });
}
function setOptions(options) {
    if (options.n != null) {
        setDropdownIfValid(numberDropdown, options.n);
    }
    if (options.regions != null) {
        var regions_1 = new Set(options.regions);
        regionCheckboxes.forEach(function (checkbox) {
            checkbox.checked = regions_1.has(checkbox.value) || options.regions.length == 0;
        });
    }
    if (options.types != null) {
        var types_1 = new Set(options.types);
        typeCheckboxes.forEach(function (checkbox) {
            checkbox.checked = types_1.has(checkbox.value) || options.types.length == 0;
        });
    }
    if (options.sublegendaries != null) {
        sublegendariesCheckbox.checked = options.sublegendaries;
    }
    if (options.legendaries != null) {
        legendariesCheckbox.checked = options.legendaries;
    }
    if (options.mythicals != null) {
        mythicalsCheckbox.checked = options.mythicals;
    }
    if (options.paradoxes != null) {
        paradoxCheckbox.checked = options.paradoxes;
    }
    if (options.ultraBeasts != null) {
        ultraBeastCheckbox.checked = options.ultraBeasts;
    }
    if (options.evolutionCounts != null) {
        var counts_1 = new Set(options.evolutionCounts);
        evolutionCountCheckboxes.forEach(function (checkbox) {
            checkbox.checked = counts_1.has(parseInt(checkbox.value)) || options.evolutionCounts.length == 0;
        });
    }
    if (options.nfes != null) {
        nfesCheckbox.checked = options.nfes;
    }
    if (options.fullyEvolved != null) {
        fullyEvolvedCheckbox.checked = options.fullyEvolved;
    }
    var sprites = options.sprites == null || options.sprites;
    var names = options.names == null || options.names;
    if (sprites && !names) {
        displayDropdown.value = "sprites";
    }
    else if (names && !sprites) {
        displayDropdown.value = "names";
    }
    else {
        displayDropdown.value = "both";
    }
    if (options.natures != null) {
        naturesCheckbox.checked = options.natures;
    }
    if (options.genders != null) {
        gendersCheckbox.checked = options.genders;
    }
    if (options.generations != null) {
        var gens_1 = new Set(options.generations);
        generationCheckboxes.forEach(function (checkbox) {
            checkbox.checked = gens_1.has(parseInt(checkbox.value)) || options.generations.length == 0;
        });
    }
    if (options.legendsOnly != null) {
        legendsOnlyCheckbox.checked = options.legendsOnly;
    }
    if (options.abilities != null) {
        abilitiesCheckbox.checked = options.abilities;
    }
    if (options.buffs != null) {
        buffsCheckbox.checked = options.buffs;
    }
    if (options.mystery != null) {
        mysteryCheckbox.checked = options.mystery;
    }
    if (options.fusion != null) {
        fusionCheckbox.checked = options.fusion;
    }
    if (options.shinyOdds != null) {
        setDropdownIfValid(shinyOddsDropdown, options.shinyOdds);
    }
    if (options.attacker != null) {
        setDropdownIfValid(attackerDropdown, options.attacker);
    }
    if (options.minHp != null)
        minHpInput.value = String(options.minHp || "");
    if (options.minAtk != null)
        minAtkInput.value = String(options.minAtk || "");
    if (options.minDef != null)
        minDefInput.value = String(options.minDef || "");
    if (options.minSpA != null)
        minSpAInput.value = String(options.minSpA || "");
    if (options.minSpD != null)
        minSpDInput.value = String(options.minSpD || "");
    if (options.minSpe != null)
        minSpeInput.value = String(options.minSpe || "");
    if (options.forms != null) {
        formsCheckbox.checked = options.forms;
    }
    if (options.megas != null) {
        megasCheckbox.checked = options.megas;
    }
    if (options.gigantamaxes != null) {
        gigantamaxesCheckbox.checked = options.gigantamaxes;
    }
    if (options.generate !== undefined) {
        generateRandom();
    }
}
function persistOptions(options) {
    var optionsJson = JSON.stringify(options);
    window.localStorage.setItem(STORAGE_OPTIONS_KEY, optionsJson);
    window.history.replaceState({}, "", "?" + convertOptionsToUrlParams(options));
}
function loadOptions() {
    if (urlHasOptions()) {
        setOptions(convertUrlParamsToOptions());
    }
    else {
        var optionsJson = window.localStorage.getItem(STORAGE_OPTIONS_KEY);
        if (optionsJson) {
            setOptions(JSON.parse(optionsJson));
        }
    }
}
function urlHasOptions() {
    var queryString = window.location.href.split("?")[1];
    return queryString && queryString.length > 0;
}
function convertUrlParamsToOptions() {
    var options = {};
    var params = new URL(window.location.href).searchParams;
    if (params.has("n")) {
        options.n = parseInt(params.get("n"));
    }
    if (params.has("region")) {
        var region = params.get("region");
        options.regions = region == "all" ? [] : [region];
    }
    if (params.has("regions")) {
        var regions = params.get("regions").split(",");
        options.regions = regions[0] == "all" ? [] : regions;
    }
    if (params.has("type")) {
        var type = params.get("type");
        options.types = type == "all" ? [] : [type];
    }
    if (params.has("types")) {
        var types = params.get("types").split(",");
        options.types = types[0] == "all" ? [] : types;
    }
    if (params.has("sublegendaries")) {
        options.sublegendaries = parseBoolean(params.get("sublegendaries"));
    }
    if (params.has("legendaries")) {
        options.legendaries = parseBoolean(params.get("legendaries"));
    }
    if (params.has("mythicals")) {
        options.mythicals = parseBoolean(params.get("mythicals"));
    }
    if (params.has("paradoxes")) {
        options.paradoxes = parseBoolean(params.get("paradoxes"));
    }
    if (params.has("ultraBeasts")) {
        options.ultraBeasts = parseBoolean(params.get("ultraBeasts"));
    }
    if (params.has("evolutionCounts")) {
        options.evolutionCounts = params.get("evolutionCounts")
            .split(",")
            .map(function (c) { return parseInt(c); });
    }
    if (params.has("nfes")) {
        options.nfes = parseBoolean(params.get("nfes"));
    }
    if (params.has("fullyEvolved")) {
        options.fullyEvolved = parseBoolean(params.get("fullyEvolved"));
    }
    if (params.has("names")) {
        options.names = parseBoolean(params.get("names"));
    }
    if (params.has("sprites")) {
        options.sprites = parseBoolean(params.get("sprites"));
    }
    if (params.has("natures")) {
        options.natures = parseBoolean(params.get("natures"));
    }
    if (params.has("genders")) {
        options.genders = parseBoolean(params.get("genders"));
    }
    if (params.has("generations")) {
        options.generations = params.get("generations")
            .split(",")
            .filter(function (x) { return x.length; })
            .map(function (g) { return parseInt(g); });
    }
    if (params.has("legendsOnly")) {
        options.legendsOnly = parseBoolean(params.get("legendsOnly"));
    }
    if (params.has("abilities")) {
        options.abilities = parseBoolean(params.get("abilities"));
    }
    if (params.has("buffs")) {
        options.buffs = parseBoolean(params.get("buffs"));
    }
    if (params.has("mystery")) {
        options.mystery = parseBoolean(params.get("mystery"));
    }
    if (params.has("fusion")) {
        options.fusion = parseBoolean(params.get("fusion"));
    }
    if (params.has("shinyOdds")) {
        options.shinyOdds = parseInt(params.get("shinyOdds"));
    }
    if (params.has("attacker")) {
        options.attacker = params.get("attacker");
    }
    if (params.has("minHp"))
        options.minHp = parseInt(params.get("minHp"));
    if (params.has("minAtk"))
        options.minAtk = parseInt(params.get("minAtk"));
    if (params.has("minDef"))
        options.minDef = parseInt(params.get("minDef"));
    if (params.has("minSpA"))
        options.minSpA = parseInt(params.get("minSpA"));
    if (params.has("minSpD"))
        options.minSpD = parseInt(params.get("minSpD"));
    if (params.has("minSpe"))
        options.minSpe = parseInt(params.get("minSpe"));
    if (params.has("forms")) {
        options.forms = parseBoolean(params.get("forms"));
    }
    if (params.has("megas")) {
        options.megas = parseBoolean(params.get("megas"));
    }
    if (params.has("gigantamaxes")) {
        options.gigantamaxes = parseBoolean(params.get("gigantamaxes"));
    }
    if (params.has("generate")) {
        options.generate = true;
    }
    return options;
}
function convertOptionsToUrlParams(options) {
    return Object.entries(options)
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        var encodableValue;
        if (Array.isArray(value)) {
            if (value.length == 0
                || (key == "types" && value.length == typeCheckboxes.length)
                || (key == "regions" && value.length == regionCheckboxes.length)
                || (key == "generations" && value.length == generationCheckboxes.length)) {
                encodableValue = "all";
            }
            else {
                encodableValue = value.join(",");
            }
        }
        else {
            encodableValue = value;
        }
        return encodeURIComponent(key) + "=" + encodeURIComponent(encodableValue);
    })
        .join("&");
}
function addFormChangeListeners() {
    toggleDropdownsOnButtonClick();
    formsCheckbox.addEventListener("change", toggleFormSubtypes);
    toggleFormSubtypes();
    document.querySelectorAll("input[type='checkbox'][data-select-all='true']").forEach(function (checkbox) {
        checkbox.addEventListener("change", selectAll);
    });
    document.querySelectorAll(".dropdown").forEach(function (dropdown) {
        updateDropdownTitle(dropdown);
        dropdown.querySelectorAll("input[type='checkbox']").forEach(function (checkbox) {
            checkbox.addEventListener("change", function () { return updateDropdownTitle(dropdown); });
        });
    });
}
function toggleFormSubtypes() {
    megasCheckbox.disabled = !formsCheckbox.checked;
    gigantamaxesCheckbox.disabled = !formsCheckbox.checked;
}
function toggleDropdownsOnButtonClick() {
    document.querySelectorAll(".dropdown").forEach(function (dropdownWrapper) {
        var button = dropdownWrapper.querySelector("button");
        var popup = dropdownWrapper.querySelector(".popup");
        if (popup) {
            button.addEventListener("click", function (e) {
                popup.classList.toggle("visible");
            });
            document.addEventListener("keydown", function (event) {
                if (event.keyCode == 27) {
                    popup.classList.remove("visible");
                }
            });
            document.addEventListener("click", function (event) {
                if (event.target instanceof HTMLElement && event.target != button
                    && !popup.contains(event === null || event === void 0 ? void 0 : event.target)) {
                    popup.classList.remove("visible");
                }
            });
        }
    });
}
function selectAll(event) {
    if (!(event.target instanceof HTMLInputElement)) {
        return;
    }
    var selectAll = event.target.checked;
    var container = event.target.closest(".popup");
    container.querySelectorAll("input[type='checkbox']:not([data-select-all])")
        .forEach(function (checkbox) { return checkbox.checked = selectAll; });
}
function updateDropdownTitle(dropdownContainer) {
    var _a, _b;
    var button = dropdownContainer.querySelector("button");
    var selectAllCheckbox = dropdownContainer.querySelector("input[type='checkbox'][data-select-all='true']");
    var allCheckboxes = Array.from(dropdownContainer.querySelectorAll("input[type='checkbox']:not([data-select-all])"));
    var selectedCheckboxes = allCheckboxes.filter(function (checkbox) { return checkbox.checked && !checkbox.disabled; });
    var allAreSelected = selectedCheckboxes.length == allCheckboxes.length;
    var allowNoSelection = !!button.dataset.allowNone;
    var pluralName = button.dataset.pluralName;
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = selectedCheckboxes.length > 0;
        selectAllCheckbox.indeterminate = !allAreSelected && selectAllCheckbox.checked;
    }
    var displayText;
    if (allowNoSelection && selectedCheckboxes.length == 0) {
        displayText = "No " + pluralName;
    }
    else if (allAreSelected || selectedCheckboxes.length == 0) {
        displayText = (_a = button.dataset.allName) !== null && _a !== void 0 ? _a : ("All " + pluralName);
    }
    else if (selectedCheckboxes.length == 1) {
        displayText = getNameForCheckbox(selectedCheckboxes[0]);
    }
    else if (button.dataset.allowShowingTwo && selectedCheckboxes.length == 2) {
        displayText = getNameForCheckbox(selectedCheckboxes[0]) + ", " + getNameForCheckbox(selectedCheckboxes[1]);
    }
    else {
        var nameForCount = (_b = button.dataset.nameForCount) !== null && _b !== void 0 ? _b : pluralName;
        displayText = selectedCheckboxes.length + " " + nameForCount;
    }
    button.innerText = displayText;
}
function getNameForCheckbox(checkbox) {
    if (checkbox.dataset.shortName) {
        return checkbox.dataset.shortName;
    }
    else {
        return checkbox.parentElement.innerText;
    }
}
var PATH_TO_SPRITES = 'sprites/normal/';
var PATH_TO_SHINY_SPRITES = 'sprites/shiny/';
var SPRITE_EXTENTION = '.webp';
var GeneratedPokemon = (function () {
    function GeneratedPokemon(pokemon, form, options) {
        var _a, _b, _c;
        this.showName = true;
        this.showSprite = true;
        if (!pokemon) {
            return;
        }
        this.showName = options.names;
        this.showSprite = options.sprites;
        this.id = pokemon.id;
        this.baseName = pokemon.name;
        this.name = getName(pokemon, form);
        this.spriteSuffix = form === null || form === void 0 ? void 0 : form.spriteSuffix;
        if (options.natures) {
            this.nature = generateNature();
        }
        var threshold = (_a = options === null || options === void 0 ? void 0 : options.shinyOdds) !== null && _a !== void 0 ? _a : 16;
        this.shiny = this.showSprite && Math.floor(Math.random() * 65536) < threshold;
        this.date = new Date();
        this.mystery = !!(options === null || options === void 0 ? void 0 : options.mystery);
        if (options.genders) {
            var ratio = (_c = (_b = form === null || form === void 0 ? void 0 : form.genderRatio) !== null && _b !== void 0 ? _b : pokemon === null || pokemon === void 0 ? void 0 : pokemon.genderRatio) !== null && _c !== void 0 ? _c : { male: 1, female: 1 };
            if (ratio != "unknown") {
                this.gender = Math.random() < (ratio.male / (ratio.male + ratio.female)) ? "male" : "female";
            }
        }
    }
    GeneratedPokemon.generate = function (pokemon, form, options) {
        return new GeneratedPokemon(pokemon, form, options);
    };
    GeneratedPokemon.fromJson = function (parsed) {
        var pokemon = new GeneratedPokemon();
        Object.assign(pokemon, parsed);
        return pokemon;
    };
    GeneratedPokemon.prototype.toHtml = function () {
        var classes = "";
        if (this.shiny) {
            classes += "shiny ";
        }
        if (!this.showSprite) {
            classes += "imageless ";
        }
        if (this.mystery) {
            classes += "mystery ";
        }
        return "<li class=\"".concat(classes, "\">\n\t\t\t").concat(this.mystery ? "<div class=\"mysteryCover\" title=\"Click to reveal\">\u26AA\uD83D\uDD34</div>" : "", "\n\t\t\t<div class=\"pokeContent\">\n\t\t\t\t").concat(this.showSprite ? this.toImage() : "", "\n\t\t\t\t").concat(this.toTextBlock(this.showName), "\n\t\t\t</div>\n\t\t</li>");
    };
    GeneratedPokemon.prototype.toHtmlForShinyHistory = function () {
        var encounterDate = this.date ?
            "<div class=\"date\" title=\"".concat(this.date, "\">Encountered on ").concat(this.date.toLocaleDateString(), "</div>")
            : "";
        return "<li>\n\t\t\t".concat(this.toImage(), "\n\t\t\t").concat(this.toText(true), "\n\t\t\t").concat(encounterDate, "\n\t\t</li>");
    };
    GeneratedPokemon.prototype.toTextBlock = function (includeName) {
        var main = this.toText(includeName);
        var extras = [];
        if (this.ability)
            extras.push("<div class=\"subline\"><span class=\"label\">Ability</span> ".concat(escapeHtml(this.ability), "</div>"));
        if (this.buff)
            extras.push("<div class=\"subline\"><span class=\"label\">Buff</span> ".concat(escapeHtml(this.buff), "</div>"));
        if (this.fusionNote)
            extras.push("<div class=\"subline subtle\">".concat(escapeHtml(this.fusionNote), "</div>"));
        return "<div class=\"textBlock\">\n\t\t\t<div class=\"mainLine\">".concat(main, "</div>\n\t\t\t").concat(extras.join(""), "\n\t\t</div>");
    };
    GeneratedPokemon.prototype.toText = function (includeName) {
        return "\n\t\t\t".concat(this.nature ? "<span class=\"nature\">".concat(this.nature, "</span>") : "", "\n\t\t\t").concat(includeName ? this.name : "", "\n\t\t\t").concat(this.genderToText(), "\n\t\t\t").concat(this.shiny ? "<span class=\"star\">&starf;</span>" : "", "\n\t\t").trim() || "&nbsp;";
    };
    GeneratedPokemon.prototype.genderToText = function () {
        if (this.name == "Nidoran ♀" || this.name == "Nidoran ♂") {
            return "";
        }
        else if (this.gender == "male") {
            return "<span class=\"male\" title=\"Male\">\u2642</span>";
        }
        else if (this.gender == "female") {
            return "<span class=\"female\" title=\"Female\">\u2640</span>";
        }
        else {
            return "";
        }
    };
    GeneratedPokemon.prototype.toImage = function () {
        var altText = (this.shiny ? "Shiny " : "") + this.name;
        return "<img src=\"".concat(this.getSpritePath(), "\" alt=\"").concat(altText, "\" title=\"").concat(altText, "\" />");
    };
    GeneratedPokemon.prototype.getSpritePath = function () {
        var _a;
        var path = this.shiny ? PATH_TO_SHINY_SPRITES : PATH_TO_SPRITES;
        var name = (_a = this.forceSpriteKey) !== null && _a !== void 0 ? _a : this.getSpriteKey();
        if (this.spriteSuffix) {
            name += "-" + this.spriteSuffix;
        }
        return path + name + SPRITE_EXTENTION;
    };
    GeneratedPokemon.prototype.getSpriteKey = function () {
        return this.normalizeName();
    };
    GeneratedPokemon.prototype.normalizeName = function () {
        var _a;
        return ((_a = this.baseName) !== null && _a !== void 0 ? _a : this.name)
            .toLowerCase()
            .replaceAll("é", "e")
            .replaceAll("♀", "f")
            .replaceAll("♂", "m")
            .replaceAll(/['.:% -]/g, "");
    };
    GeneratedPokemon.prototype.populateFromShowdown = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var spriteKey, entry, abilitiesObj, pool, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!options.abilities && !options.buffs)
                            return [2];
                        if (!options.abilities) return [3, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        spriteKey = this.getSpriteKey();
                        if (this.spriteSuffix)
                            spriteKey += '-' + this.spriteSuffix;
                        return [4, getExtrasForSpriteKey(spriteKey, this.name)];
                    case 2:
                        entry = _b.sent();
                        abilitiesObj = (_a = entry === null || entry === void 0 ? void 0 : entry.abilities) !== null && _a !== void 0 ? _a : {};
                        pool = Object.values(abilitiesObj).filter(Boolean);
                        if (pool.length)
                            this.ability = pool[Math.floor(Math.random() * pool.length)];
                        return [3, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.warn(e_1);
                        return [3, 4];
                    case 4:
                        if (options.buffs) {
                            this.buff = BUFFS[Math.floor(Math.random() * BUFFS.length)];
                        }
                        return [2];
                }
            });
        });
    };
    GeneratedPokemon.generateFusion = function (generated, options) {
        var _a, _b, _c;
        var fusion = new GeneratedPokemon();
        var a = generated[Math.floor(Math.random() * generated.length)];
        var b = generated[Math.floor(Math.random() * generated.length)];
        var an = ((_a = a.baseName) !== null && _a !== void 0 ? _a : a.name) || 'MonA';
        var bn = ((_b = b.baseName) !== null && _b !== void 0 ? _b : b.name) || 'MonB';
        var halfA = Math.max(2, Math.ceil(an.length / 2));
        var halfB = Math.max(2, Math.floor(bn.length / 2));
        var rawName = (an.slice(0, halfA) + bn.slice(halfB)).replace(/\s+/g, ' ').trim();
        Object.assign(fusion, {
            id: 0,
            baseName: rawName,
            name: rawName + ' (Fusion)',
            showName: options.names,
            showSprite: options.sprites,
            isFusion: true,
            fusionNote: "Mixed from ".concat(a.name, " + ").concat(b.name),
            forceSpriteKey: 'fusion',
            mystery: !!options.mystery,
            date: new Date(),
        });
        if (options.natures)
            fusion.nature = generateNature();
        var threshold = (_c = options === null || options === void 0 ? void 0 : options.shinyOdds) !== null && _c !== void 0 ? _c : 16;
        Object.assign(fusion, {
            shiny: (options.sprites && Math.floor(Math.random() * 65536) < threshold),
        });
        if (options.abilities) {
            var pool = generated.map(function (p) { return p.ability; }).filter(Boolean);
            if (pool.length)
                fusion.ability = pool[Math.floor(Math.random() * pool.length)];
        }
        if (options.buffs) {
            fusion.buff = BUFFS[Math.floor(Math.random() * BUFFS.length)];
        }
        return fusion;
    };
    return GeneratedPokemon;
}());
function escapeHtml(text) {
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
var BUFFS = [
    "+20% damage",
    "+20% bulk",
    "+1 priority on first move",
    "Immune to status",
    "Heals 1/16 HP each turn",
    "Critical hits deal 1.5x",
    "Moves have +10% accuracy",
    "Resists super-effective damage (0.85x)",
];
function getName(pokemon, form) {
    if (form) {
        if (form.name) {
            return form.name;
        }
        else if (form.isMega) {
            return pokemon.name + " Mega";
        }
        else if (form.isGigantamax) {
            return pokemon.name + " Gigantamax";
        }
    }
    return pokemon.name;
}
function mergePokemon(primary, secondary) {
    var _a, _b;
    if (!secondary || (!primary.forms && !secondary.forms)) {
        return primary;
    }
    var merged = JSON.parse(JSON.stringify(primary));
    merged.forms = mergeForms((_a = primary === null || primary === void 0 ? void 0 : primary.forms) !== null && _a !== void 0 ? _a : [primary], (_b = secondary.forms) !== null && _b !== void 0 ? _b : [secondary]);
    return merged;
}
function mergeForms(primaries, secondaries) {
    var formsBySpriteSuffix = new Map();
    for (var _i = 0, _a = [secondaries, primaries]; _i < _a.length; _i++) {
        var forms = _a[_i];
        for (var _b = 0, forms_1 = forms; _b < forms_1.length; _b++) {
            var form = forms_1[_b];
            formsBySpriteSuffix.set(form.spriteSuffix, form);
        }
    }
    return Array.from(formsBySpriteSuffix.values());
}
function generateNature() {
    return getRandomElement(NATURES);
}
var NATURES = ["Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle",
    "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Na&iuml;ve",
    "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"];
function generateRandom() {
    return __awaiter(this, void 0, void 0, function () {
        var options, eligiblePokemon, generatedPokemon, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    markLoading(true);
                    options = getOptionsFromForm();
                    persistOptions(options);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4, getEligiblePokemon(options)];
                case 2:
                    eligiblePokemon = _a.sent();
                    return [4, chooseRandom(eligiblePokemon, options)];
                case 3:
                    generatedPokemon = _a.sent();
                    addToHistory(generatedPokemon);
                    displayPokemon(generatedPokemon);
                    return [3, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    displayPokemon(null);
                    return [3, 5];
                case 5:
                    markLoading(false);
                    return [2];
            }
        });
    });
}
function onPageLoad() {
    loadOptions();
    toggleHistoryVisibility();
    addFormChangeListeners();
    displayYearsInFooter();
}
document.addEventListener("DOMContentLoaded", onPageLoad);
function displayPokemon(pokemon) {
    var resultsContainer = document.getElementById("results");
    if (!pokemon) {
        resultsContainer.innerHTML = "An error occurred while generating Pok&eacute;mon.";
    }
    else if (pokemon.length == 0) {
        resultsContainer.innerHTML = "No matching Pok&eacute;mon found.";
    }
    else {
        resultsContainer.innerHTML = toHtml(pokemon);
        bindMysteryReveal();
    }
}
var cachedOptionsJson;
var cachedEligiblePokemon;
function getEligiblePokemon(options) {
    return __awaiter(this, void 0, void 0, function () {
        var optionsJson, eligiblePokemon, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    optionsJson = JSON.stringify(options);
                    if (!(cachedOptionsJson == optionsJson)) return [3, 1];
                    return [2, Promise.resolve(cachedEligiblePokemon)];
                case 1:
                    _a = filterByOptions;
                    return [4, getPokemonInRegions(options.regions)];
                case 2: return [4, _a.apply(void 0, [_b.sent(), options])];
                case 3:
                    eligiblePokemon = _b.sent();
                    cachedOptionsJson = optionsJson;
                    cachedEligiblePokemon = eligiblePokemon;
                    return [2, eligiblePokemon];
            }
        });
    });
}
var showdownDexCache = null;
function getShowdownDex() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (showdownDexCache)
                return [2, showdownDexCache];
            showdownDexCache = (function () { return __awaiter(_this, void 0, void 0, function () {
                var res, json, map, _i, _a, _b, key, entry, e;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4, fetch('https://play.pokemonshowdown.com/data/pokedex.json', { cache: 'force-cache' })];
                        case 1:
                            res = _c.sent();
                            if (!res.ok)
                                throw new Error('Failed to fetch Pokémon Showdown dex data.');
                            return [4, res.json()];
                        case 2:
                            json = _c.sent();
                            map = new Map();
                            for (_i = 0, _a = Object.entries(json); _i < _a.length; _i++) {
                                _b = _a[_i], key = _b[0], entry = _b[1];
                                e = entry;
                                map.set(key.toLowerCase(), e);
                                if (e.spriteid)
                                    map.set(String(e.spriteid).toLowerCase(), e);
                                if (e.name)
                                    map.set(normalizeForLookup(String(e.name)), e);
                            }
                            return [2, map];
                    }
                });
            }); })();
            return [2, showdownDexCache];
        });
    });
}
function normalizeForLookup(name) {
    return name
        .toLowerCase()
        .replaceAll('é', 'e')
        .replaceAll('♀', 'f')
        .replaceAll('♂', 'm')
        .replaceAll(/[^a-z0-9]+/g, '');
}
function getExtrasForSpriteKey(spriteKey, displayName) {
    return __awaiter(this, void 0, void 0, function () {
        var dex, candidates, _i, candidates_1, c, hit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, getShowdownDex()];
                case 1:
                    dex = _a.sent();
                    candidates = [
                        spriteKey,
                        spriteKey.replaceAll('-', ''),
                        spriteKey.replaceAll('-gigantamax', 'gmax'),
                        spriteKey.replaceAll('-mega-x', 'megax'),
                        spriteKey.replaceAll('-mega-y', 'megay'),
                        (displayName ? normalizeForLookup(displayName) : ''),
                    ].filter(Boolean);
                    for (_i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
                        c = candidates_1[_i];
                        hit = dex.get(String(c).toLowerCase());
                        if (hit)
                            return [2, hit];
                    }
                    return [2, null];
            }
        });
    });
}
function getPokemonInRegions(regions) {
    return __awaiter(this, void 0, void 0, function () {
        var responses, pokemonById, _i, responses_1, response, pokemonInRegion, _a, pokemonInRegion_1, pokemon;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (regions.length == regionCheckboxes.length || regions.length == 0) {
                        regions = ["all"];
                    }
                    return [4, Promise.all(regions.map(function (region) { return fetch("dex/" + region + ".json"); }))];
                case 1:
                    responses = _b.sent();
                    pokemonById = new Map();
                    _i = 0, responses_1 = responses;
                    _b.label = 2;
                case 2:
                    if (!(_i < responses_1.length)) return [3, 5];
                    response = responses_1[_i];
                    if (!response.ok) {
                        console.error(response);
                        throw Error("Failed to get eligible Pokémon.");
                    }
                    return [4, response.json()];
                case 3:
                    pokemonInRegion = _b.sent();
                    if (responses.length == 1) {
                        return [2, pokemonInRegion];
                    }
                    for (_a = 0, pokemonInRegion_1 = pokemonInRegion; _a < pokemonInRegion_1.length; _a++) {
                        pokemon = pokemonInRegion_1[_a];
                        pokemonById.set(pokemon.id, mergePokemon(pokemon, pokemonById.get(pokemon.id)));
                    }
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5: return [2, Array.from(pokemonById.values())];
            }
        });
    });
}
function filterByOptions(pokemonInRegions, options) {
    return __awaiter(this, void 0, void 0, function () {
        var evolutionCounts, types, generations, needsShowdown, e_2, out, _i, pokemonInRegions_1, pokemon, gen, isLegendFamily, evolutionCount, keptForms, _a, _b, form;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    evolutionCounts = new Set(options.evolutionCounts);
                    types = new Set(options.types);
                    generations = new Set(options.generations);
                    needsShowdown = options.attacker !== 'any' ||
                        options.minHp > 0 || options.minAtk > 0 || options.minDef > 0 || options.minSpA > 0 || options.minSpD > 0 || options.minSpe > 0 ||
                        options.abilities;
                    if (!needsShowdown) return [3, 4];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4, getShowdownDex()];
                case 2:
                    _d.sent();
                    return [3, 4];
                case 3:
                    e_2 = _d.sent();
                    console.warn(e_2);
                    return [3, 4];
                case 4:
                    out = [];
                    _i = 0, pokemonInRegions_1 = pokemonInRegions;
                    _d.label = 5;
                case 5:
                    if (!(_i < pokemonInRegions_1.length)) return [3, 13];
                    pokemon = pokemonInRegions_1[_i];
                    if (generations.size > 0 && generations.size != 9) {
                        gen = getGenerationFromDexNum(pokemon.id);
                        if (!generations.has(gen))
                            return [3, 12];
                    }
                    if (options.legendsOnly) {
                        isLegendFamily = !!(pokemon.isSubLegendary || pokemon.isLegendary || pokemon.isMythical || pokemon.isParadox || pokemon.isUltraBeast);
                        if (!isLegendFamily)
                            return [3, 12];
                    }
                    if (!options.sublegendaries && pokemon.isSubLegendary)
                        return [3, 12];
                    if (!options.legendaries && pokemon.isLegendary)
                        return [3, 12];
                    if (!options.mythicals && pokemon.isMythical)
                        return [3, 12];
                    if (!options.paradoxes && pokemon.isParadox)
                        return [3, 12];
                    if (!options.ultraBeasts && pokemon.isUltraBeast)
                        return [3, 12];
                    if (options.nfes || options.fullyEvolved) {
                        if (!options.nfes && pokemon.isNfe)
                            return [3, 12];
                        if (!options.fullyEvolved && !pokemon.isNfe)
                            return [3, 12];
                    }
                    if (evolutionCounts.size > 0) {
                        evolutionCount = (_c = pokemon.evolutionCount) !== null && _c !== void 0 ? _c : 0;
                        if (!evolutionCounts.has(evolutionCount))
                            return [3, 12];
                    }
                    if (!(options.forms && pokemon.forms)) return [3, 10];
                    keptForms = [];
                    _a = 0, _b = pokemon.forms;
                    _d.label = 6;
                case 6:
                    if (!(_a < _b.length)) return [3, 9];
                    form = _b[_a];
                    if (!options.megas && form.isMega)
                        return [3, 8];
                    if (!options.gigantamaxes && form.isGigantamax)
                        return [3, 8];
                    if (!filterByType(pokemon, form, types))
                        return [3, 8];
                    return [4, passesStatsAndAttacker(pokemon, form, options)];
                case 7:
                    if (!(_d.sent()))
                        return [3, 8];
                    keptForms.push(form);
                    _d.label = 8;
                case 8:
                    _a++;
                    return [3, 6];
                case 9:
                    if (keptForms.length === 0)
                        return [3, 12];
                    pokemon.forms = keptForms;
                    out.push(pokemon);
                    return [3, 12];
                case 10:
                    if (!filterByType(pokemon, null, types))
                        return [3, 12];
                    return [4, passesStatsAndAttacker(pokemon, null, options)];
                case 11:
                    if (!(_d.sent()))
                        return [3, 12];
                    out.push(pokemon);
                    _d.label = 12;
                case 12:
                    _i++;
                    return [3, 5];
                case 13: return [2, out];
            }
        });
    });
}
function getGenerationFromDexNum(num) {
    if (num <= 151)
        return 1;
    if (num <= 251)
        return 2;
    if (num <= 386)
        return 3;
    if (num <= 493)
        return 4;
    if (num <= 649)
        return 5;
    if (num <= 721)
        return 6;
    if (num <= 809)
        return 7;
    if (num <= 905)
        return 8;
    return 9;
}
function filterByType(pokemon, form, types) {
    var _a;
    return types.size === 0 || ((_a = form === null || form === void 0 ? void 0 : form.types) !== null && _a !== void 0 ? _a : pokemon.types).some(function (type) { return types.has(type); });
}
function passesStatsAndAttacker(pokemon, form, options) {
    return __awaiter(this, void 0, void 0, function () {
        var needs, spriteKey, displayName, entry, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    needs = options.attacker !== 'any'
                        || options.minHp > 0 || options.minAtk > 0 || options.minDef > 0 || options.minSpA > 0 || options.minSpD > 0 || options.minSpe > 0;
                    if (!needs)
                        return [2, true];
                    spriteKey = normalizeSpriteKey(pokemon.name);
                    if (form === null || form === void 0 ? void 0 : form.spriteSuffix)
                        spriteKey += '-' + form.spriteSuffix;
                    displayName = getName(pokemon, form !== null && form !== void 0 ? form : undefined);
                    return [4, getExtrasForSpriteKey(spriteKey, displayName)];
                case 1:
                    entry = _a.sent();
                    s = entry === null || entry === void 0 ? void 0 : entry.baseStats;
                    if (!s)
                        return [2, false];
                    if (s.hp < options.minHp)
                        return [2, false];
                    if (s.atk < options.minAtk)
                        return [2, false];
                    if (s.def < options.minDef)
                        return [2, false];
                    if (s.spa < options.minSpA)
                        return [2, false];
                    if (s.spd < options.minSpD)
                        return [2, false];
                    if (s.spe < options.minSpe)
                        return [2, false];
                    if (options.attacker === 'special') {
                        if (!(s.spa > s.atk))
                            return [2, false];
                    }
                    if (options.attacker === 'physical') {
                        if (!(s.atk >= s.spa))
                            return [2, false];
                    }
                    return [2, true];
            }
        });
    });
}
function normalizeSpriteKey(name) {
    return name
        .toLowerCase()
        .replaceAll('é', 'e')
        .replaceAll('♀', 'f')
        .replaceAll('♂', 'm')
        .replaceAll(/['.:% -]/g, '');
}
function chooseRandom(eligiblePokemon, options) {
    return __awaiter(this, void 0, void 0, function () {
        var generated, pokemon, form, gp, shuffled, fusion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    generated = [];
                    eligiblePokemon = JSON.parse(JSON.stringify(eligiblePokemon));
                    _a.label = 1;
                case 1:
                    if (!(eligiblePokemon.length > 0 && generated.length < options.n)) return [3, 3];
                    pokemon = removeRandomElement(eligiblePokemon);
                    form = null;
                    if (options.forms && pokemon.forms) {
                        form = removeRandomElement(pokemon.forms);
                        if (form.isMega) {
                            eligiblePokemon = removeMegas(eligiblePokemon);
                        }
                        if (form.isGigantamax) {
                            eligiblePokemon = removeGigantamaxes(eligiblePokemon);
                        }
                    }
                    gp = GeneratedPokemon.generate(pokemon, form, options);
                    return [4, gp.populateFromShowdown(options)];
                case 2:
                    _a.sent();
                    generated.push(gp);
                    return [3, 1];
                case 3:
                    shuffled = shuffle(generated);
                    if (options.fusion && shuffled.length > 0) {
                        fusion = GeneratedPokemon.generateFusion(shuffled, options);
                        shuffled.push(fusion);
                    }
                    return [2, shuffled];
            }
        });
    });
}
function bindMysteryReveal() {
    var covers = Array.from(document.querySelectorAll('.mysteryCover'));
    if (covers.length === 0)
        return;
    covers.forEach(function (cover) {
        cover.addEventListener('click', function () {
            var li = cover.closest('li');
            if (!li)
                return;
            li.classList.add('revealed');
            cover.remove();
        });
    });
}
function removeMegas(pokemonArray) {
    return pokemonArray.filter(function (pokemon) {
        if (pokemon.forms) {
            pokemon.forms = pokemon.forms.filter(function (form) { return !form.isMega; });
            return pokemon.forms.length > 0;
        }
        else {
            return true;
        }
    });
}
function removeGigantamaxes(pokemonArray) {
    return pokemonArray.filter(function (pokemon) {
        if (pokemon.forms) {
            pokemon.forms = pokemon.forms.filter(function (form) { return !form.isGigantamax; });
            return pokemon.forms.length > 0;
        }
        else {
            return true;
        }
    });
}
function toHtml(pokemon) {
    return "<ol>".concat(pokemon.map(function (p) { return p.toHtml(); }).join(""), "</ol>");
}
function getRandomElement(arr) {
    return arr[randomInteger(arr.length)];
}
function removeRandomElement(arr) {
    return arr.splice(randomInteger(arr.length), 1)[0];
}
function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = randomInteger(i + 1);
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}
function randomInteger(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
}
function markLoading(isLoading) {
    document.getElementById("controls").classList.toggle("loading", isLoading);
}
function setDropdownIfValid(select, value) {
    var option = select.querySelector("[value='" + value + "']");
    if (option) {
        select.value = option.value;
    }
}
function parseBoolean(boolean) {
    return boolean.toLowerCase() == "true";
}
function displayYearsInFooter() {
    document.querySelectorAll("span[data-since]").forEach(function (span) {
        span.innerText = span.dataset.since + "-" + new Date().getFullYear();
    });
}

// test/bosses-simulador.test.js - Test suite para el Simulador de Bosses y Optimizador de Equipos
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: SIMULADOR DE BOSSES & OPTIMIZADOR ===');

// Leer custom-ui.js
const customUiSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'custom-ui.js'), 'utf8');

// 1. Verificar presencia de componentes clave en custom-ui.js
assert.ok(customUiSrc.includes('#bossesOverlay'), 'El modal #bossesOverlay debe estar estilizado en custom-ui.js');
assert.ok(customUiSrc.includes('mountBossesButton'), 'window.mountBossesButton debe estar implementado');
assert.ok(customUiSrc.includes('BOSSES_CONFIG'), 'BOSSES_CONFIG debe estar configurado');
assert.ok(customUiSrc.includes('CLAN_TYPES_TABLE'), 'CLAN_TYPES_TABLE debe estar definido con los 10 clanes');
assert.ok(customUiSrc.includes('getHeldItemBonus'), 'getHeldItemBonus debe reconocer held items');
assert.ok(customUiSrc.includes('evaluateCandidateVsBoss'), 'evaluateCandidateVsBoss debe existir');
assert.ok(customUiSrc.includes('simulateTeamBattle'), 'simulateTeamBattle debe existir');
assert.ok(customUiSrc.includes('initBossesModal'), 'initBossesModal debe estar presente');
assert.ok(customUiSrc.includes('renderBossesModal'), 'renderBossesModal debe estar presente');

console.log('OK  Componentes DOM y funciones exportadas verificadas');

// Extraer funciones y objetos para pruebas directas en contexto aislado
const extractSnippet = (startMarker, endMarker) => {
  const i = customUiSrc.indexOf(startMarker);
  assert.ok(i !== -1, 'No se encontró ' + startMarker);
  const j = customUiSrc.indexOf(endMarker, i);
  assert.ok(j !== -1, 'No se encontró ' + endMarker);
  return customUiSrc.slice(i, j);
};

const moduleCode = extractSnippet('const BOSSES_CONFIG = {', 'window.initBossesModal = function() {');
const sandbox = {};
const fn = new Function('sandbox', moduleCode + '\n' + `
  sandbox.BOSSES_CONFIG = BOSSES_CONFIG;
  sandbox.CLAN_TYPES_TABLE = CLAN_TYPES_TABLE;
  sandbox.CLAN_INFO = CLAN_INFO;
  sandbox.RARITY_THEME = RARITY_THEME;
  sandbox.getHeldItemBonus = getHeldItemBonus;
  sandbox.evaluateCandidateVsBoss = evaluateCandidateVsBoss;
  sandbox.simulateTeamBattle = simulateTeamBattle;
  sandbox.getItemIconUrl = getItemIconUrl;
  sandbox.HELD_OFFICIAL_TABLE = HELD_OFFICIAL_TABLE;
`);
fn(sandbox);

const { BOSSES_CONFIG, CLAN_TYPES_TABLE, CLAN_INFO, getHeldItemBonus, evaluateCandidateVsBoss, simulateTeamBattle, getItemIconUrl } = sandbox;

// 2. Verificar configuración de los Bosses activos y sus assets
assert.ok(BOSSES_CONFIG.cruel, 'Giant Cruel debe existir');
assert.equal(BOSSES_CONFIG.cruel.level, 600, 'Giant Cruel debe ser nivel 600');
assert.equal(BOSSES_CONFIG.cruel.hp, 79240, 'Giant Cruel debe tener 79.240 HP');
assert.ok(BOSSES_CONFIG.cruel.avatar.startsWith('https://'), 'Giant Cruel debe tener URL de avatar');
assert.ok(BOSSES_CONFIG.cruel.drops.length >= 8, 'Giant Cruel debe tener al menos 8 drops definidos');
BOSSES_CONFIG.cruel.drops.forEach(d => {
  assert.ok(d.icon, `Drop ${d.name} de Giant Cruel debe tener propiedad icon`);
  assert.ok(getItemIconUrl(d.icon).startsWith('https://'), `Icono de ${d.name} debe resolver a URL válida`);
});

assert.ok(BOSSES_CONFIG.aerodactyl2, 'Ancient Aero debe existir');
assert.equal(BOSSES_CONFIG.aerodactyl2.level, 500, 'Ancient Aero debe ser nivel 500');
assert.equal(BOSSES_CONFIG.aerodactyl2.hp, 79240, 'Ancient Aero debe tener 79.240 HP');
assert.ok(BOSSES_CONFIG.aerodactyl2.avatar.startsWith('https://'), 'Ancient Aero debe tener URL de avatar');
assert.ok(BOSSES_CONFIG.aerodactyl2.drops.length >= 8, 'Ancient Aero debe tener al menos 8 drops definidos');
BOSSES_CONFIG.aerodactyl2.drops.forEach(d => {
  assert.ok(d.icon, `Drop ${d.name} de Ancient Aero debe tener propiedad icon`);
  assert.ok(getItemIconUrl(d.icon).startsWith('https://'), `Icono de ${d.name} debe resolver a URL válida`);
});

console.log('OK  BOSSES_CONFIG validado (Giant Cruel 79.2K HP, Ancient Aero 79.2K HP, avatares y drops con iconos)');

// 3. Verificar tabla de Clanes y Metadatos de CLAN_INFO
assert.ok(CLAN_TYPES_TABLE.naturia.includes('GRASS') && CLAN_TYPES_TABLE.naturia.includes('BUG'), 'Naturia debe incluir Grass y Bug');
assert.ok(CLAN_TYPES_TABLE.seavell.includes('WATER') && CLAN_TYPES_TABLE.seavell.includes('ICE'), 'Seavell debe incluir Water e Ice');
assert.ok(CLAN_TYPES_TABLE.orebound.includes('ROCK'), 'Orebound debe incluir Rock');
assert.ok(CLAN_TYPES_TABLE.gardestrike.includes('NORMAL') && CLAN_TYPES_TABLE.gardestrike.includes('FIGHTING'), 'Gardestrike debe incluir Normal y Fighting');

assert.ok(CLAN_INFO.orebound && CLAN_INFO.orebound.icon === '⛰️', 'Orebound debe tener icono ⛰️');
assert.ok(CLAN_INFO.naturia && CLAN_INFO.naturia.icon === '🌿', 'Naturia debe tener icono 🌿');
assert.equal(Object.keys(CLAN_INFO).length, 10, 'CLAN_INFO debe contener los 10 clanes oficiales');

console.log('OK  CLAN_TYPES_TABLE y CLAN_INFO validados con afinidades oficiales e iconos');

// 4. Verificar multiplicadores de Held Items (Valores oficiales de Pokepedia)
const vit3 = getHeldItemBonus('vida_3');
assert.equal(vit3.hp, 1.03, 'vida_3 (X-Vitality Tier III) debe dar +3% HP');
assert.equal(vit3.atk, 1.0, 'X-Vitality no debe alterar Atk');
assert.equal(vit3.label, 'X-Vitality III (+3% HP)');

const vit1 = getHeldItemBonus('X-Vitality Tier 1');
assert.equal(vit1.hp, 1.0125, 'X-Vitality Tier I debe dar +1.25% HP');

const atk3 = getHeldItemBonus('ataque_3');
assert.equal(atk3.atk, 1.04, 'ataque_3 (X-Attack Tier III) debe dar +4% Atk');

const def3 = getHeldItemBonus('defesa_3');
assert.equal(def3.def, 1.04, 'defesa_3 (X-Defense Tier III) debe dar +4% Def');

const misto3 = getHeldItemBonus('misto_3');
assert.equal(misto3.atk, 1.02, 'misto_3 (X-Boost Tier III) debe dar +2% Atk');
assert.equal(misto3.def, 1.02, 'misto_3 (X-Boost Tier III) debe dar +2% Def');

console.log('OK  Held Items oficiales aplicados (X-Vitality +3% HP, X-Attack +4% Atk, X-Defense +4% Def, X-Boost +2% Atk/Def)');

// 5. Verificar cálculo de sinergia de Clan (+15% ATK)
const pokeGrass = { name: 'Venusaur', level: 400, quality: 1.5, type1: 'GRASS', type2: 'POISON', stats: { hp: 4000, atk: 1200, def: 1000, spa: 1200, spd: 1000, vel: 800 } };
const evalNoClan = evaluateCandidateVsBoss(pokeGrass, BOSSES_CONFIG.cruel, null);
const evalNaturia = evaluateCandidateVsBoss(pokeGrass, BOSSES_CONFIG.cruel, 'naturia');
assert.equal(evalNoClan.clanMult, 1.0, 'Sin clan el multiplicador debe ser 1.0');
assert.equal(evalNaturia.clanMult, 1.15, 'Con clan Naturia Venusaur debe recibir +15% de sinergia');
assert.ok(evalNaturia.effectiveAtk > evalNoClan.effectiveAtk, 'Ataque efectivo debe ser mayor con clan');

console.log('OK  Sinergia de clan evaluada (+15% ATK aplicado en Venusaur [Naturia])');

// 6. Prueba de combate: Victoria en Equipo
const team = [
  { name: 'Tyranitar', level: 689, quality: 1.8, type1: 'ROCK', type2: 'DARK', power: 22000, stats: { hp: 1975, atk: 1764, def: 1875, spa: 1687, spd: 1632, vel: 1216 }, clan: null, heldItem: 'vida_3' },
  { name: 'Exeggutor', level: 565, quality: 2.18, type1: 'GRASS', type2: 'PSYCHIC', power: 18000, stats: { hp: 1887, atk: 1678, def: 1573, spa: 1910, spd: 1340, vel: 1412 }, clan: null, heldItem: '' },
  { name: 'Dragonite', level: 525, quality: 1.8, type1: 'DRAGON', type2: 'FLYING', power: 16000, stats: { hp: 1367, atk: 1386, def: 1067, spa: 1042, spd: 1327, vel: 1294 }, clan: 'wingeon', heldItem: 'X-Attack' },
  { name: 'Rampardos', level: 480, quality: 1.77, type1: 'ROCK', power: 14000, stats: { hp: 4800, atk: 1650, def: 850, spa: 500, spd: 700, vel: 800 }, clan: 'orebound', heldItem: '' },
  { name: 'Snorlax', level: 450, quality: 1.8, type1: 'NORMAL', power: 13000, stats: { hp: 6500, atk: 1100, def: 950, spa: 600, spd: 1200, vel: 300 }, clan: 'gardestrike', heldItem: 'X-Vitality' },
  { name: 'Rhyperior', level: 420, quality: 1.7, type1: 'GROUND', type2: 'ROCK', power: 12000, stats: { hp: 5200, atk: 1400, def: 1300, spa: 500, spd: 700, vel: 400 }, clan: 'orebound', heldItem: 'X-Defense' }
];

const resAero = simulateTeamBattle(team, BOSSES_CONFIG.aerodactyl2, null);
assert.equal(resAero.victory, true, 'El equipo debe vencer a Ancient Aero');
assert.equal(resAero.soloKill, false, 'No fue solo-kill (requirió 2 luchadores)');
assert.ok(resAero.members[2].didNotEnter, 'El slot 3 no debió entrar (quedó en reserva)');
assert.ok(resAero.members[3].didNotEnter, 'El slot 4 no debió entrar (quedó en reserva)');

console.log('OK  Simulación vs Ancient Aero: Victoria en equipo con reserva ilesa');

// 6b. Probar selección de Clan en "Todas las cuentas" (Sin clan por defecto vs Clan específico seleccionado)
// A) Sin Clan (por defecto en Todas las cuentas): ninguno recibe bonus
const resSinClan = simulateTeamBattle(team, BOSSES_CONFIG.aerodactyl2, 'none');
assert.equal(resSinClan.members[0].clanBonus, false, 'Sin clan activo, Tyranitar no debe recibir bonus');
assert.equal(resSinClan.members[1].clanBonus, false, 'Sin clan activo, Exeggutor no debe recibir bonus');
assert.equal(resSinClan.members[2].clanBonus, false, 'Sin clan activo, Dragonite no debe recibir bonus');

// B) Orebound seleccionado: solo Tyranitar (Roca) recibe bonus
const resOrebound = simulateTeamBattle(team, BOSSES_CONFIG.aerodactyl2, 'orebound');
assert.equal(resOrebound.members[0].clanBonus, true, 'Con Orebound activo, Tyranitar (Roca) debe recibir bonus');
assert.equal(resOrebound.members[0].clanName, 'Orebound', 'Nombre del clan debe ser Orebound');
assert.equal(resOrebound.members[1].clanBonus, false, 'Con Orebound activo, Exeggutor no debe recibir bonus');

// C) Naturia seleccionado: solo Exeggutor (Planta) recibe bonus
const resNaturia = simulateTeamBattle(team, BOSSES_CONFIG.aerodactyl2, 'naturia');
assert.equal(resNaturia.members[0].clanBonus, false, 'Con Naturia activo, Tyranitar no debe recibir bonus');
assert.equal(resNaturia.members[1].clanBonus, true, 'Con Naturia activo, Exeggutor (Planta) debe recibir bonus');
assert.equal(resNaturia.members[1].clanName, 'Naturia', 'Nombre del clan debe ser Naturia');

console.log('OK  Selección dinámica de clan en Todas las cuentas verificada (Sin clan 0%, Orebound y Naturia filtrando por tipos)');

// 7. Prueba de combate: Solo-Kill
const soloGodSnorlax = [
  { name: 'Ultra Snorlax', level: 850, quality: 2.2, type1: 'NORMAL', power: 38000, stats: { hp: 14000, atk: 2400, def: 2200, spa: 1000, spd: 2200, vel: 400 }, clan: 'gardestrike', heldItem: 'X-Vitality' }
];
const resSolo = simulateTeamBattle(soloGodSnorlax, BOSSES_CONFIG.aerodactyl2, 'gardestrike');
assert.equal(resSolo.victory, true, 'Ultra Snorlax debe vencer');
assert.equal(resSolo.soloKill, true, 'Debe marcarse como SOLO-KILL');

console.log('OK  Simulación Solo-Kill: Ultra Snorlax derrota a Ancient Aero en solitario');

// 8. Prueba de combate: Daño Insuficiente / Derrota
const weakTeam = [
  { name: 'Rattata', level: 50, quality: 1.0, type1: 'NORMAL', stats: { hp: 300, atk: 100, def: 80, spa: 50, spd: 70, vel: 120 } }
];
const resDefeat = simulateTeamBattle(weakTeam, BOSSES_CONFIG.cruel, null);
assert.equal(resDefeat.victory, false, 'Equipo débil debe ser derrotado');
assert.ok(resDefeat.remainingBossHp > 0, 'Debe quedar vida en el boss');
assert.ok(resDefeat.bossHpPctRemaining > 90, 'El boss debe conservar casi toda la vida');

console.log('OK  Simulación Derrota: Equipo débil fainted y vida restante del boss correcta');

// 9. Verificar renderBossesModal y selector de clanes en DOM mockeado
class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      toggle: (c, v) => v ? this.classList._classes.add(c) : this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.attributes = {};
    this.style = {};
    this.innerHTML = '';
    this.textContent = '';
    this.children = [];
    this._onclick = null;
  }
  set onclick(fn) { this._onclick = fn; }
  get onclick() { return this._onclick; }
  getAttribute(name) { return this.attributes[name] || null; }
  setAttribute(name, val) { this.attributes[name] = String(val); }
  querySelector(sel) {
    if (sel.startsWith('#')) {
      const id = sel.slice(1);
      if (this.id === id) return this;
      for (const child of this.children) {
        const found = child.querySelector(sel);
        if (found) return found;
      }
    }
    return null;
  }
  querySelectorAll(sel) {
    const res = [];
    const check = (node) => {
      if (sel.startsWith('.') && node.className.includes(sel.slice(1))) res.push(node);
      for (const child of node.children) check(child);
    };
    check(this);
    return res;
  }
  appendChild(child) { this.children.push(child); return child; }
  remove() {}
}

const mockOverlay = new MockElement('div', 'bossesOverlay');
mockOverlay.classList.add('show');
const mockBodyContent = new MockElement('div', 'bsBodyContent');
mockOverlay.children.push(mockBodyContent);

const mockDoc = {
  getElementById: (id) => {
    if (id === 'bossesOverlay') return mockOverlay;
    if (id === 'bsBodyContent') return mockBodyContent;
    return null;
  },
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: (tag) => new MockElement(tag),
  body: new MockElement('body'),
  head: new MockElement('head')
};

const mockWindow = {
  document: mockDoc,
  localStorage: { getItem: () => null, setItem: () => {} },
  addEventListener: () => {},
  setTimeout: () => {},
  setInterval: () => {},
  __pokesTrainers: [{ idx: 0, name: 'Ash', dot: '#ff0000', clan: 'orebound' }],
  __pokes300Data: [
    { name: 'Tyranitar', level: 689, quality: 1.8, type1: 'ROCK', type2: 'DARK', power: 22000, stats: { hp: 1975, atk: 1764, def: 1875, spa: 1687, spd: 1632, vel: 1216 }, accIdx: 0, heldItem: 'vida_3' }
  ]
};

const fullFn = new Function('window', 'document', 'localStorage', 'setTimeout', 'setInterval', customUiSrc);
fullFn(mockWindow, mockDoc, mockWindow.localStorage, () => {}, () => {});

assert.equal(typeof mockWindow.renderBossesModal, 'function', 'renderBossesModal debe estar disponible');
mockWindow.renderBossesModal();

assert.ok(mockBodyContent.innerHTML.includes('bs-clan-bar'), 'El modal debe renderizar la barra de clanes');
assert.ok(mockBodyContent.innerHTML.includes('bs-clan-chips'), 'El modal debe renderizar los chips de clanes');
assert.ok(mockBodyContent.innerHTML.includes('Sin Clan (0% bonus por defecto)'), 'El modal debe incluir la opción Sin Clan por defecto');
assert.ok(mockBodyContent.innerHTML.includes('Orebound'), 'El modal debe incluir el chip de Orebound desbloqueado');
assert.ok(mockBodyContent.innerHTML.includes('bs-fighter-card'), 'El modal debe renderizar los cards de luchadores');

console.log('OK  renderBossesModal en DOM mockeado: renderizado completo y sin errores en tiempo de ejecución');

console.log('\n¡TODAS LAS PRUEBAS DEL SIMULADOR DE BOSSES PASARON AL 100%!');

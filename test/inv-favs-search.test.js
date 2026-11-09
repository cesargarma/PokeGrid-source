// test/inv-favs-search.test.js
// Verifica que marcar favoritos en el Inventario Global los fije arriba y que el buscador
// persista el texto y los resultados sin resetearse tras refrescos periódicos.

const assert = require('assert');
const fs = require('fs');

console.log('=== TEST SUITE: INVENTARIO GLOBAL FAVORITOS Y BUSCADOR ===');

// Mock básico de DOM y Storage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
    _store: () => store
  };
})();

global.localStorage = localStorageMock;
global.window = global;
global.window.addEventListener = () => {};
global.document = {
  head: {
    appendChild: () => {}
  },
  body: {
    appendChild: () => {}
  },
  addEventListener: () => {},
  getElementById: (id) => null,
  createElement: (tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      className: '',
      id: '',
      style: {},
      dataset: {},
      _innerHTML: '',
      textContent: '',
      parentNode: null,
      childNodes: [],
      children: [],
      querySelector: function(sel) {
        if (sel === '.cd-fav-sep-text') {
          return this.childNodes.find(c => c.className && c.className.includes('cd-fav-sep-text')) || null;
        }
        return null;
      },
      querySelectorAll: function() { return []; },
      appendChild: function(ch) {
        ch.parentNode = this;
        this.childNodes.push(ch);
        this.children.push(ch);
        return ch;
      },
      insertBefore: function(newNode, refNode) {
        newNode.parentNode = this;
        const idx = this.childNodes.indexOf(refNode);
        if (idx >= 0) {
          this.childNodes.splice(idx, 0, newNode);
          this.children.splice(idx, 0, newNode);
        } else {
          this.childNodes.push(newNode);
          this.children.push(newNode);
        }
        return newNode;
      },
      remove: function() {
        if (this.parentNode) {
          const idx = this.parentNode.childNodes.indexOf(this);
          if (idx >= 0) {
            this.parentNode.childNodes.splice(idx, 1);
            this.parentNode.children.splice(idx, 1);
          }
        }
      },
      addEventListener: function() {}
    };

    Object.defineProperty(el, 'innerHTML', {
      get() { return this._innerHTML; },
      set(val) {
        this._innerHTML = val;
        if (val.includes('cd-fav-sep-text')) {
          const textSpan = {
            tagName: 'SPAN',
            className: 'cd-fav-sep-text',
            textContent: '',
            style: {}
          };
          this.appendChild(textSpan);
        }
      }
    });

    return el;
  }
};

// 1. Cargar custom-ui.js
require('../src/custom-ui.js');

assert(typeof window.enhanceInvCard === 'function', 'enhanceInvCard debe estar exportada');
console.log('OK  enhanceInvCard está definida y accesible');

// 2. Simular un DOM de Inventario con 3 items
function setupInventoryDOM(searchVal = '') {
  const cdSec = {
    childNodes: [],
    children: [],
    appendChild: function(ch) {
      ch.parentNode = this;
      const existingIdx = this.childNodes.indexOf(ch);
      if (existingIdx >= 0) {
        this.childNodes.splice(existingIdx, 1);
        this.children.splice(existingIdx, 1);
      }
      this.childNodes.push(ch);
      this.children.push(ch);
      return ch;
    },
    insertBefore: function(newNode, refNode) {
      newNode.parentNode = this;
      const existingIdx = this.childNodes.indexOf(newNode);
      if (existingIdx >= 0) {
        this.childNodes.splice(existingIdx, 1);
        this.children.splice(existingIdx, 1);
      }
      const idx = this.childNodes.indexOf(refNode);
      if (idx >= 0) {
        this.childNodes.splice(idx, 0, newNode);
        this.children.splice(idx, 0, newNode);
      } else {
        this.childNodes.push(newNode);
        this.children.push(newNode);
      }
      return newNode;
    }
  };

  const inp = {
    value: searchVal,
    blur: () => {},
    addEventListener: function(event, handler) {
      this['on' + event] = handler;
    }
  };

  const cfgRow = { parentNode: cdSec, nextSibling: null };
  cdSec.appendChild(cfgRow);

  function createRow(id, name, qty) {
    const star = {
      className: 'cd-fav-inv',
      dataset: { inv: id, n: name },
      textContent: '☆',
      style: {}
    };
    const hide = {
      className: 'cd-hide',
      dataset: { inv: id },
      style: {}
    };
    const rn = {
      className: 'rn',
      textContent: name
    };
    const row = {
      className: 'cd-row',
      title: name,
      dataset: { inv: id },
      style: {},
      parentNode: cdSec,
      querySelector: function(sel) {
        if (sel === '.cd-fav-inv') return star;
        if (sel === '.cd-hide[data-inv]') return hide;
        if (sel === '.rn') return rn;
        return null;
      }
    };
    return { row, star };
  }

  const item1 = createRow('1', 'Ultra Ball', 50);
  const item2 = createRow('2', 'Caramelo Raro', 10);
  const item3 = createRow('3', 'Super Potion', 100);

  const rows = [item1.row, item2.row, item3.row];
  rows.forEach(r => cdSec.appendChild(r));

  const invIt = {
    dataset: { s: 'inv' },
    querySelector: function(sel) {
      if (sel === '#cdInvF') return inp;
      if (sel === '.cd-sec') return cdSec;
      if (sel === '.cd-fav-sep') {
        return cdSec.childNodes.find(c => c.className === 'cd-fav-sep') || null;
      }
      if (sel === '.cd-cfg-row') return cfgRow;
      if (sel === '.cd-empty') return null;
      if (sel === '#cdShowHiddenInv') return null;
      return null;
    },
    querySelectorAll: function(sel) {
      return cdSec.childNodes.filter(c => c.className === 'cd-row');
    }
  };

  global.document.querySelector = (sel) => {
    if (sel === '.cd-it[data-s="inv"]') return invIt;
    return null;
  };

  return { invIt, inp, cdSec, rows, item1, item2, item3 };
}

// TEST 1: Marcar como favorito un ítem
localStorageMock.clear();
let dom = setupInventoryDOM();
window.enhanceInvCard();

// Inicialmente ningún favorito
assert.strictEqual(localStorageMock.getItem('invFavs'), null);
assert.strictEqual(dom.item2.star.textContent, '☆');

// Usuario hace clic en la estrella del Caramelo Raro (item2)
dom.item2.star.onclick({ stopPropagation: () => {} });

// Debe haberse guardado en localStorage
const savedFavs = JSON.parse(localStorageMock.getItem('invFavs') || '{}');
assert(savedFavs['2'], 'Caramelo Raro (id 2) debe estar en invFavs');
console.log('OK  Guardado de favorito en localStorage verificado:', savedFavs);

// Al re-ejecutar enhanceInvCard, item2 debe ser fav, tener estrella dorada y estar arriba
window.enhanceInvCard();
assert.strictEqual(dom.item2.star.textContent, '★');
assert.strictEqual(dom.item2.row.__isFav, true);

// El orden en cdSec debe tener item2 primero entre las filas
const rowsInDom = dom.cdSec.childNodes.filter(ch => ch.className === 'cd-row');
assert.strictEqual(rowsInDom[0].dataset.inv, '2', 'El favorito (Caramelo Raro) debe estar primero en el DOM');
console.log('OK  El ítem favorito se fijó arriba de la lista en el DOM');

// TEST 2: Buscador no debe resetearse y debe persistir en localStorage
dom.inp.value = 'ultra';
dom.inp.oninput();

assert.strictEqual(localStorageMock.getItem('cdInvF'), 'ultra', 'cdInvF debe guardarse en localStorage al tipear');
console.log('OK  cdInvF persiste en localStorage al escribir');

// Comprobar filtrado: el favorito (Caramelo Raro) permanece visible, Ultra Ball visible, Super Potion oculta
assert.strictEqual(dom.item2.row.style.display, '', 'Favorito siempre visible independientemente del filtro');
assert.strictEqual(dom.item1.row.style.display, '', 'Ultra Ball coincide con búsqueda');
assert.strictEqual(dom.item3.row.style.display, 'none', 'Super Potion NO coincide y se oculta');
console.log('OK  Filtrado en vivo correcto: favoritos se mantienen visibles y los demás se filtran');

// Simular refresco periódico de tarjetas: se crea un nuevo DOM con el valor de búsqueda guardado
const dom2 = setupInventoryDOM(localStorageMock.getItem('cdInvF'));
assert.strictEqual(dom2.inp.value, 'ultra', 'El input conserva el texto de búsqueda tras el refresco');
window.enhanceInvCard();
assert.strictEqual(localStorageMock.getItem('cdInvF'), 'ultra', 'El refresco no borra cdInvF');
assert.strictEqual(dom2.item2.star.textContent, '★', 'El favorito sigue marcado como favorito en el nuevo DOM');
console.log('OK  El refresco periódico no resetea el input ni limpia cdInvF ni pierde favoritos');

// TEST 3: Desmarcar favorito en dom2
dom2.item2.star.onclick({ stopPropagation: () => {} });
const updatedFavs = JSON.parse(localStorageMock.getItem('invFavs') || '{}');
assert(!updatedFavs['2'], 'Caramelo Raro debe haberse eliminado de favoritos');
window.enhanceInvCard();
assert.strictEqual(dom2.item2.star.textContent, '☆');
console.log('OK  Desmarcar favorito funciona correctamente');

console.log('\n¡TODAS LAS PRUEBAS DE INVENTARIO PASARON AL 100%!');

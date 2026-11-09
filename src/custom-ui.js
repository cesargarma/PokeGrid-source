// src/custom-ui.js - Extensión de UI en vivo para PokeGrid (recarga sin reiniciar juegos)
(function() {
  // Asegurar que cdInvF no mantenga un filtro estricto que destruya los elementos en SB.inv
  try {
    const lastF = localStorage.getItem('cdInvF');
    if (lastF) {
      window.__invFilterSaved = lastF;
      localStorage.setItem('cdInvF', '');
    }
  } catch {}

  // Estilos personalizados
  window.setCustomStyle = function(css) {
    let el = document.getElementById('pgCustomStyle');
    if (!el) {
      el = document.createElement('style');
      el.id = 'pgCustomStyle';
      document.head.appendChild(el);
    }
    el.textContent = css || '';
  };

  window.setCustomStyle(`
    .cd-fav-inv {
      cursor: pointer;
      flex: none;
      font-size: 13px;
      line-height: 1;
      margin-left: 6px;
      user-select: none;
      transition: transform 0.15s ease, color 0.15s ease;
    }
    .cd-fav-inv:hover {
      transform: scale(1.25);
      color: var(--gold) !important;
    }
    .cd-fav-sep {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0 6px;
      padding: 2px 2px;
      user-select: none;
    }
    .cd-fav-sep-line {
      flex: 1;
      height: 1px;
      background: var(--bd2);
    }
    .cd-fav-sep-line.left {
      background: linear-gradient(90deg, rgba(227,179,65,0.45), var(--bd2));
    }
    .cd-fav-sep-line.right {
      background: linear-gradient(90deg, var(--bd2), rgba(227,179,65,0.45));
    }
    .cd-fav-sep-text {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--mut);
      white-space: nowrap;
    }
  `);

  // Card Consumibles (Pokéballs, Potions, Divisas)
  window.CUSTOM_SB_CONSUMABLES = function(ctx) {
    const { cols, t, esc, ico, fmtQty, fmtVip, getQty, nf } = ctx;
    const coinSvg = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style="flex:none"><circle cx="8" cy="8" r="6.5" fill="#f2c665" stroke="#a9781f" stroke-width="1"/><circle cx="8" cy="8" r="4.2" fill="none" stroke="#c9922f" stroke-width="1"/><path d="M5 4.3a4.5 4.5 0 0 1 3.5-1" stroke="#fff2c8" stroke-width="1" fill="none" stroke-linecap="round" opacity=".85"/></svg>';

    const inner = cols.length ? '<div style="display:grid;grid-template-columns:repeat(' + Math.min(4, Math.max(1, cols.length)) + ',minmax(0,1fr));gap:12px">' + cols.map(r => {
      const isWait = r.st !== 'on';
      const ub = getQty(r, 'ball', 4, 'ultra ball');
      const ib = getQty(r, 'ball', 9, 'idle ball');
      const up = getQty(r, 'item', 204, 'ultra potion');
      return '<div style="background:var(--bg);border:1px solid var(--bd2);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:8px">'
        + '<div style="display:flex;align-items:center;gap:6px;border-bottom:1px solid var(--bd2);padding-bottom:7px">'
        + '<span class="cd-dot" style="background:' + r.dot + ';flex-shrink:0"></span>'
        + '<span style="color:var(--tx2);font-size:11px;font-weight:600">C' + (r.i + 1) + ':</span>'
        + '<b style="color:var(--tx);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(r.name) + '</b>'
        + '<span style="color:var(--tx3);font-size:11px;font-weight:600">Lv.' + (r.tlv || 1) + '</span>'
        + '<span style="margin-left:auto">' + (isWait ? '<span style="color:var(--mut);font-size:11px">—</span>' : fmtVip(r.vip, r.vipUntil)) + '</span>'
        + '</div>'
        + (isWait ? '<div class="cd-empty" style="padding:15px 0">' + (t('cdWaiting') || 'Aguardando…') + '</div>' :
          '<div style="display:flex;flex-direction:column;gap:8px">'
          + '<div>'
          + '<div style="font-size:11px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;display:flex;align-items:center;gap:5px">'
          + ico('pokebola') + '<span>Pokéballs</span></div>'
          + '<div style="display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.02);border:1px solid var(--bd);border-radius:6px;padding:4px 8px">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;padding:2px 0">'
          + '<span style="display:inline-flex;align-items:center;gap:6px;color:var(--tx2)"><span style="width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 4px var(--gold)"></span>Ultra Ball</span>'
          + '<b style="color:var(--tx);font-variant-numeric:tabular-nums;font-size:12px">' + fmtQty(ub) + '</b></div>'
          + '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;padding:2px 0;border-top:1px solid rgba(255,255,255,.04)">'
          + '<span style="display:inline-flex;align-items:center;gap:6px;color:var(--tx2)"><span style="width:6px;height:6px;border-radius:50%;background:var(--xp);box-shadow:0 0 4px var(--xp)"></span>Idle Ball</span>'
          + '<b style="color:var(--tx);font-variant-numeric:tabular-nums;font-size:12px">' + fmtQty(ib) + '</b></div>'
          + '</div></div>'
          + '<div>'
          + '<div style="font-size:11px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;display:flex;align-items:center;gap:5px">'
          + ico('coracao') + '<span>Potions</span></div>'
          + '<div style="display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.02);border:1px solid var(--bd);border-radius:6px;padding:4px 8px">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;padding:2px 0">'
          + '<span style="display:inline-flex;align-items:center;gap:6px;color:var(--tx2)"><span style="width:6px;height:6px;border-radius:50%;background:var(--ok);box-shadow:0 0 4px var(--ok)"></span>Ultra Potion</span>'
          + '<b style="color:var(--tx);font-variant-numeric:tabular-nums;font-size:12px">' + fmtQty(up) + '</b></div>'
          + '</div></div>'
          + '<div>'
          + '<div style="font-size:11px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;display:flex;align-items:center;gap:5px">'
          + coinSvg + '<span>' + (t('cdCurrencies') || 'Divisas') + '</span></div>'
          + '<div style="display:flex;flex-direction:column;gap:2px;background:rgba(255,255,255,.02);border:1px solid var(--bd);border-radius:6px;padding:4px 8px">'
          + '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;padding:2px 0">'
          + '<span style="display:inline-flex;align-items:center;gap:6px;color:var(--tx2)"><span style="width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 4px var(--gold)"></span>' + (t('cdMoney') || 'Dinero') + '</span>'
          + '<b style="color:var(--gold);font-variant-numeric:tabular-nums;font-size:12px">$' + nf(+r.gold || 0) + '</b></div>'
          + '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11.5px;padding:2px 0;border-top:1px solid rgba(255,255,255,.04)">'
          + '<span style="display:inline-flex;align-items:center;gap:6px;color:var(--tx2)"><span style="width:6px;height:6px;border-radius:50%;background:#5bc0ff;box-shadow:0 0 4px #5bc0ff"></span>' + (t('cdDiamonds') || 'Diamantes') + '</span>'
          + '<b style="color:var(--dia);font-variant-numeric:tabular-nums;font-size:12px">' + nf(+r.diamonds || 0) + '</b></div>'
          + '</div></div>'
          + '</div>')
        + '</div>';
    }).join('') + '</div>' : '<div class="cd-empty">' + t('cdNone') + '</div>';

    return '<div class="cd-sec"><div class="cd-h" style="display:flex;align-items:center;gap:8px"><span>' + (t('cdConsumables') || 'Consumibles') + '</span></div>' + inner + '</div>';
  };

  // Cache persistente de elementos de inventario para que los favoritos nunca desaparezcan
  window.__invCache = window.__invCache || {};

  // Card Inventario Global en caliente (permite marcar favoritos, fijarlos arriba y barra separadora)
  let isEnhancing = false;
  window.enhanceInvCard = function() {
    if (isEnhancing) return;
    const invIt = document.querySelector('.cd-it[data-s="inv"]');
    if (!invIt) return;

    let invFavs = {};
    try { invFavs = JSON.parse(localStorage.getItem('invFavs') || '{}'); } catch {}

    const inp = invIt.querySelector('#cdInvF');
    const filterText = (inp ? inp.value : '').trim().toLowerCase();

    // Interceptar input, enter y change en cdInvF para que nunca limpie la lista de favoritos
    if (inp && !inp.__hasFavIntercept) {
      inp.__hasFavIntercept = true;
      inp.onkeydown = function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          inp.blur();
          try { localStorage.setItem('cdInvF', ''); } catch {}
          window.enhanceInvCard();
        }
      };
      inp.onchange = function(e) {
        if (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        try { localStorage.setItem('cdInvF', ''); } catch {}
        window.enhanceInvCard();
      };
      inp.oninput = function() {
        window.enhanceInvCard();
      };
    }

    // Buscar contenedor de filas
    const cdSec = invIt.querySelector('.cd-sec');
    if (!cdSec) return;

    isEnhancing = true;
    try {
      // Registrar y cachear filas existentes
      const currentRows = Array.from(invIt.querySelectorAll('.cd-row'));
      currentRows.forEach(row => {
        const hideEl = row.querySelector('.cd-hide[data-inv]');
        const starEl = row.querySelector('.cd-fav-inv');
        const id = (starEl && starEl.dataset.inv) || (hideEl && hideEl.dataset.inv) || '';
        const rnEl = row.querySelector('.rn');
        const nameText = rnEl ? rnEl.textContent.trim() : '';
        if (id) {
          window.__invCache[id] = {
            id,
            name: nameText || id,
            rowHtml: row.outerHTML
          };
        }
      });

      // Si hay favoritos guardados que no están en el DOM (porque la búsqueda o paginación los ocultó), restaurarlos del cache
      for (const favId in invFavs) {
        if (!invFavs[favId]) continue;
        const exists = currentRows.some(r => {
          const s = r.querySelector('.cd-fav-inv') || r.querySelector('.cd-hide[data-inv]');
          return s && s.dataset.inv === favId;
        });
        if (!exists) {
          const cached = window.__invCache[favId];
          const itemName = (cached && cached.name) || (typeof invFavs[favId] === 'string' ? invFavs[favId] : ('#' + favId));
          const newRow = document.createElement('div');
          newRow.className = 'cd-row';
          newRow.title = itemName;
          newRow.innerHTML = '<span class="rn">' + itemName + '</span><span>0</span>'
            + '<span class="cd-fav-inv" data-inv="' + favId + '" data-n="' + itemName + '" title="Quitar de favoritos" style="cursor:pointer;flex:none;font-size:13px;line-height:1;margin-left:6px;user-select:none;color:var(--gold)">★</span>'
            + '<span class="cd-hide" data-inv="' + favId + '" style="cursor:pointer;color:var(--mut)"><svg class="ico" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>';
          // Insertar en la lista
          const cfgRow = invIt.querySelector('.cd-cfg-row');
          if (cfgRow && cfgRow.nextSibling) {
            cdSec.insertBefore(newRow, cfgRow.nextSibling);
          } else {
            cdSec.appendChild(newRow);
          }
          currentRows.push(newRow);
        }
      }

      // Si tenemos favoritos y había un aviso de "nada todavía", removerlo
      const hasAnyFav = Object.keys(invFavs).some(k => invFavs[k]);
      const emptyEl = invIt.querySelector('.cd-empty');
      if (hasAnyFav && emptyEl) {
        emptyEl.remove();
      }

      // Procesar todas las filas actualizadas
      const allRows = Array.from(invIt.querySelectorAll('.cd-row'));
      allRows.forEach(row => {
        const hideEl = row.querySelector('.cd-hide[data-inv]');
        let star = row.querySelector('.cd-fav-inv');
        const id = (star && star.dataset.inv) || (hideEl && hideEl.dataset.inv) || '';
        const rnEl = row.querySelector('.rn');
        const nameText = rnEl ? rnEl.textContent.trim() : '';

        const isFav = !!(invFavs[id] || (nameText && invFavs[nameText.toLowerCase()]));
        row.__isFav = isFav;
        row.__name = nameText.toLowerCase();

        if (!star) {
          star = document.createElement('span');
          star.className = 'cd-fav-inv';
          star.dataset.inv = id;
          star.dataset.n = nameText;
          if (hideEl) row.insertBefore(star, hideEl);
          else row.appendChild(star);
        }

        star.dataset.inv = id;
        star.dataset.n = nameText;
        star.textContent = isFav ? '★' : '☆';
        star.style.color = isFav ? 'var(--gold)' : '#444c56';
        star.title = isFav ? 'Quitar de favoritos' : 'Fijar como favorito';

        star.onclick = (e) => {
          e.stopPropagation();
          if (invFavs[id] || (nameText && invFavs[nameText.toLowerCase()])) {
            delete invFavs[id];
            if (nameText) delete invFavs[nameText.toLowerCase()];
          } else {
            invFavs[id] = nameText || 1;
          }
          try { localStorage.setItem('invFavs', JSON.stringify(invFavs)); } catch {}
          try { localStorage.setItem('cdInvF', ''); } catch {}
          window.enhanceInvCard();
        };

        // Filtro de búsqueda:
        // Los favoritos se muestran SIEMPRE independientemente de la búsqueda
        if (isFav) {
          row.style.display = '';
        } else if (filterText) {
          row.style.display = row.__name.includes(filterText) ? '' : 'none';
        } else {
          row.style.display = '';
        }
      });

      // Separar filas favoritas y no favoritas
      const favRows = allRows.filter(r => r.__isFav);
      const nonFavRows = allRows.filter(r => !r.__isFav);
      const visibleNonFavs = nonFavRows.filter(r => r.style.display !== 'none');

      // Buscar o crear la barra separadora
      let sep = invIt.querySelector('.cd-fav-sep');
      if (favRows.length > 0) {
        if (!sep) {
          sep = document.createElement('div');
          sep.className = 'cd-fav-sep';
          sep.innerHTML = '<span class="cd-fav-sep-line left"></span><span class="cd-fav-sep-text"></span><span class="cd-fav-sep-line right"></span>';
        }
        const textEl = sep.querySelector('.cd-fav-sep-text');
        if (filterText) {
          if (visibleNonFavs.length > 0) {
            textEl.textContent = 'Resultados (' + visibleNonFavs.length + ')';
          } else {
            textEl.textContent = 'Sin otros resultados para "' + filterText + '"';
          }
        } else {
          textEl.textContent = 'Otros ítems (' + nonFavRows.length + ')';
        }
        sep.style.display = '';
      } else if (sep) {
        sep.style.display = 'none';
      }

      // Reordenar en el DOM:
      // 1. Filas favoritas arriba del todo
      // 2. Barra separadora (si hay favoritos)
      // 3. Filas no favoritas
      // 4. Pie de página (mostrar ocultos)
      const container = allRows.length ? allRows[0].parentNode : cdSec;
      favRows.forEach(r => container.appendChild(r));
      if (sep && favRows.length > 0) {
        container.appendChild(sep);
      }
      nonFavRows.forEach(r => container.appendChild(r));

      const pe = invIt.querySelector('#cdShowHiddenInv');
      if (pe && pe.parentNode && pe.parentNode.parentNode === container) {
        container.appendChild(pe.parentNode);
      }
    } finally {
      setTimeout(() => { isEnhancing = false; }, 30);
    }
  };

  // Ejecución inicial y observación de cambios en el contenedor de cards
  setTimeout(() => {
    window.enhanceInvCard();
    const cards = document.getElementById('cards');
    if (cards && !window.__cardsInvObserver) {
      window.__cardsInvObserver = new MutationObserver(() => {
        if (!isEnhancing) window.enhanceInvCard();
      });
      window.__cardsInvObserver.observe(cards, { childList: true, subtree: true });
    }
  }, 50);
})();

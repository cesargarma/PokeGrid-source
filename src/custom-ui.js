// src/custom-ui.js - Extensión de UI en vivo para PokeGrid (recarga sin reiniciar juegos)
(function() {
  window.CUSTOM_COLUMNS = true;
  window.enhanceTableCard = () => {};
  try {
    if (typeof cardsOn !== 'undefined' && cardsOn && typeof refreshCards === 'function') {
      if (typeof cdHtmlAnt !== 'undefined') cdHtmlAnt = '';
      refreshCards(true);
    }
  } catch {}
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

    /* Modal y Vista de Pokémon Lv 300+ */
    #pokesOverlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.72);
      backdrop-filter: blur(2px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 800;
      padding: 16px;
    }
    #pokesOverlay.show {
      display: flex;
    }
    #pokesModal {
      background: var(--sf, #161b22);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 12px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55);
      width: 960px;
      max-width: 96vw;
      height: 85vh;
      max-height: 850px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .pk-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--bd2, #30363d);
      background: var(--sf2, #1c2128);
      user-select: none;
    }
    .pk-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .pk-title h2 {
      font-size: 16px;
      font-weight: 700;
      color: var(--tx, #e6edf3);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pk-badge-lv {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(242, 198, 101, 0.15);
      border: 1px solid rgba(242, 198, 101, 0.35);
      color: var(--gold, #f2c665);
    }
    .pk-badge-count {
      font-size: 11.5px;
      color: var(--mut, #8b949e);
      background: rgba(255, 255, 255, 0.05);
      padding: 2px 8px;
      border-radius: 6px;
    }
    .pk-hd-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pk-hd-actions button {
      background: transparent;
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      color: var(--mut, #8b949e);
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }
    .pk-hd-actions button:hover {
      background: var(--bd, #21262d);
      color: var(--tx, #e6edf3);
      border-color: var(--tx2, #8b949e);
    }
    .pk-close-btn {
      font-size: 14px !important;
      padding: 4px 9px !important;
    }
    .pk-presets-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 18px;
      background: rgba(1, 4, 9, 0.45);
      border-bottom: 1px solid var(--bd2, #30363d);
      overflow-x: auto;
    }
    .pk-presets-bar::-webkit-scrollbar {
      height: 4px;
    }
    .pk-presets-bar::-webkit-scrollbar-thumb {
      background: var(--bd2, #30363d);
      border-radius: 2px;
    }
    .pk-preset-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 11px;
      font-size: 11.5px;
      font-weight: 600;
      background: var(--sf2, #1c2128);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 999px;
      color: var(--mut, #8b949e);
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      transition: all 0.12s ease;
    }
    .pk-preset-btn:hover {
      border-color: var(--mut, #8b949e);
      color: var(--tx, #e6edf3);
    }
    .pk-preset-btn.on {
      background: rgba(242, 198, 101, 0.12);
      border-color: var(--gold, #f2c665);
      color: var(--gold, #f2c665);
      font-weight: 700;
      box-shadow: 0 0 8px rgba(242, 198, 101, 0.15);
    }
    .pk-preset-count {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: inherit;
      font-variant-numeric: tabular-nums;
    }
    .pk-preset-btn.on .pk-preset-count {
      background: rgba(242, 198, 101, 0.22);
    }
    .pk-load-more-btn {
      background: var(--sf2, #1c2128);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      color: var(--tx, #e6edf3);
      padding: 6px 18px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .pk-load-more-btn:hover {
      background: var(--bd, #21262d);
      border-color: #388bfd;
      color: #388bfd;
    }
    .pk-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px 18px;
      background: var(--bg, #0d1117);
      border-bottom: 1px solid var(--bd2, #30363d);
      font-size: 12px;
    }
    .pk-search-box {
      position: relative;
      flex: 1;
      min-width: 180px;
      max-width: 300px;
    }
    .pk-search-box svg {
      position: absolute;
      left: 9px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--mut, #8b949e);
      pointer-events: none;
    }
    .pk-search-box input {
      width: 100%;
      box-sizing: border-box;
      background: var(--sf, #161b22);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      padding: 5px 10px 5px 30px;
      color: var(--tx, #e6edf3);
      font-size: 12px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .pk-search-box input:focus {
      border-color: #388bfd;
      box-shadow: 0 0 0 2px rgba(56, 139, 253, 0.25);
    }
    .pk-trainer-chips {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: wrap;
    }
    .pk-chip {
      background: var(--sf, #161b22);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      color: var(--mut, #8b949e);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      user-select: none;
      transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
    }
    .pk-chip:hover {
      background: var(--bd, #21262d);
      color: var(--tx, #e6edf3);
    }
    .pk-chip.on {
      background: var(--tx, #e6edf3);
      color: var(--bg, #0d1117);
      border-color: var(--tx, #e6edf3);
    }
    .pk-chip.on .pk-chip-dot {
      box-shadow: 0 0 0 1px var(--bg, #0d1117);
    }
    .pk-chip-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .pk-shiny-btn {
      background: var(--sf, #161b22);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      color: var(--mut, #8b949e);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .pk-shiny-btn:hover {
      color: #f778ba;
      border-color: #f778ba;
    }
    .pk-shiny-btn.on {
      background: rgba(247, 120, 186, 0.15);
      border-color: #f778ba;
      color: #f778ba;
      font-weight: 700;
    }
    .pk-counts {
      margin-left: auto;
      font-size: 11.5px;
      color: var(--mut, #8b949e);
      white-space: nowrap;
    }
    .pk-table-container {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;
      position: relative;
    }
    .pk-table-container::-webkit-scrollbar {
      width: 9px;
      height: 9px;
    }
    .pk-table-container::-webkit-scrollbar-thumb {
      background: var(--bd2, #30363d);
      border-radius: 5px;
    }
    .pk-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 12px;
    }
    .pk-table thead {
      position: sticky;
      top: 0;
      background: var(--sf2, #1c2128);
      z-index: 5;
      box-shadow: 0 1px 0 var(--bd2, #30363d);
    }
    .pk-table th {
      padding: 9px 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--mut, #8b949e);
      user-select: none;
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 1px solid var(--bd2, #30363d);
      transition: color 0.12s ease;
    }
    .pk-table th:hover {
      color: var(--tx, #e6edf3);
    }
    .pk-table th.active-sort {
      color: var(--gold, #f2c665);
    }
    .pk-sort-arrow {
      display: inline-block;
      margin-left: 3px;
      font-size: 11px;
    }
    .pk-table td {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(48, 54, 61, 0.45);
      vertical-align: middle;
      color: var(--tx, #e6edf3);
    }
    .pk-row {
      cursor: pointer;
      transition: background 0.1s ease;
    }
    .pk-row:hover {
      background: rgba(56, 139, 253, 0.08);
    }
    .pk-row:hover td {
      color: #fff;
    }
    .pk-cell-trainer {
      display: flex;
      align-items: center;
      gap: 7px;
      white-space: nowrap;
      font-weight: 600;
    }
    .pk-cell-poke {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .pk-sprite-wrap {
      width: 34px;
      height: 34px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    .pk-sprite-wrap img {
      width: 32px;
      height: 32px;
      image-rendering: pixelated;
      object-fit: contain;
    }
    .pk-poke-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .pk-poke-name-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pk-poke-name {
      font-weight: 700;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pk-shiny-badge {
      font-size: 11px;
      color: var(--gold, #f2c665);
      filter: drop-shadow(0 0 3px rgba(242, 198, 101, 0.6));
    }
    .pk-team-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(88, 166, 255, 0.15);
      color: #58a6ff;
      border: 1px solid rgba(88, 166, 255, 0.3);
    }
    .pk-types-row {
      display: flex;
      gap: 4px;
    }
    .pk-type-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      color: #fff;
      line-height: 1.2;
    }
    .pk-lv-badge {
      display: inline-block;
      font-weight: 700;
      font-size: 12px;
      color: var(--tx, #e6edf3);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      padding: 2px 7px;
      font-variant-numeric: tabular-nums;
    }
    .pk-iv-cell {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-variant-numeric: tabular-nums;
    }
    .pk-iv-text {
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .pk-iv-bar {
      height: 4px;
      width: 70px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .pk-iv-bar-fill {
      height: 100%;
      border-radius: 2px;
    }
    .pk-qual-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pk-qual-num {
      font-weight: 700;
      font-size: 12px;
      font-variant-numeric: tabular-nums;
    }
    .pk-qual-raro {
      font-size: 11px;
      font-weight: 600;
    }
    .pk-pw-cell {
      font-weight: 800;
      font-size: 13px;
      color: var(--tx, #e6edf3);
      font-variant-numeric: tabular-nums;
    }
    .pk-btn-ver {
      background: transparent;
      border: 1px solid var(--bd2, #30363d);
      border-radius: 6px;
      color: var(--mut, #8b949e);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      pointer-events: none;
    }
    .pk-row:hover .pk-btn-ver {
      background: #388bfd;
      border-color: #388bfd;
      color: #fff;
    }
    .pk-state-msg {
      padding: 40px 20px;
      text-align: center;
      color: var(--mut, #8b949e);
      font-size: 13px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .pk-spinner {
      width: 22px;
      height: 22px;
      border: 2px solid var(--bd2, #30363d);
      border-top-color: var(--gold, #f2c665);
      border-radius: 50%;
      animation: pkSpin 0.75s linear infinite;
    }
    @keyframes pkSpin {
      to { transform: rotate(360deg); }
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

  // =========================================================================
  // VISTA Y MODAL DE POKÉMON MULTI-FILTRO DE TODAS LAS CUENTAS
  // =========================================================================
  window.__pokes300Data = window.__pokes300Data || [];
  let pokesSortKey = 'level';
  let pokesSortAsc = false;
  let pokesTrainerFilter = 'all';
  let pokesPreset = 'lv300';
  let pokesRenderLimit = 100;
  let pokesSearchText = '';
  let pokesShinyOnly = false;
  let pokesIsLoading = false;

  const POKES_PRESETS = [
    { id: 'lv300', label: 'Nv 300+', badge: 'Nv 300+', test: pk => +pk.level >= 300, defaultSort: 'level', defaultAsc: false },
    { id: 'session', label: 'Capturas (Sesión) 🎯', badge: 'Capturas de la Sesión 🎯', test: pk => !!pk.isSessionCatch, defaultSort: 'catchTime', defaultAsc: false },
    { id: 'team', label: 'En Equipo ⚔️', badge: 'En Equipo ⚔️', test: pk => !!pk.team, defaultSort: 'trainer', defaultAsc: true },
    { id: 'iv160', label: 'IV 160+ ⭐', badge: 'IV 160+ ⭐', test: pk => pk.ivTotal != null && +pk.ivTotal >= 160, defaultSort: 'ivTotal', defaultAsc: false },
    { id: 'all', label: 'Todos 🌐', badge: 'Todos 🌐', test: () => true, defaultSort: 'level', defaultAsc: false }
  ];

  const TIPO_COR = {
    normal:'#a8a878', fire:'#f08030', water:'#6890f0', electric:'#f8d030', grass:'#78c850', ice:'#98d8d8',
    fighting:'#c03028', poison:'#a040a0', ground:'#e0c068', flying:'#a890f0', psychic:'#f85888', bug:'#a8b820',
    rock:'#b8a038', ghost:'#705898', dragon:'#7038f8', dark:'#705848', steel:'#b8b8d0', fairy:'#ee99ac'
  };

  const RARO_INFO = (q) => {
    return q >= 4 ? ['Divina', '#dbefff'] :
           q >= 3 ? ['Anciã', '#b8860b'] :
           q >= 2 ? ['Mítica', '#a77bea'] :
           q >= 1.7 ? ['Lendária', '#ff8c3c'] :
           q >= 1.5 ? ['Épica', '#f0c040'] :
           q >= 1.3 ? ['Rara', '#b06cff'] :
           q >= 1.1 ? ['Incomum', '#7fd4ff'] :
           q >= 1 ? ['Comum', '#63d873'] : ['Fraca', '#9aa6b3'];
  };

  const POT_COR = (pct) => {
    return pct >= 90 ? '#f2c665' : pct >= 75 ? '#3fb950' : pct >= 55 ? '#79c0ff' : pct >= 35 ? '#8b949e' : '#f85149';
  };

  const POKES_LV300_QUERY = `(() => {
    try {
      const P = window.__poke;
      if (!P || !P.ws) return { ok: false, error: 'no_poke' };
      const pokes = (P.ws.pokes && Array.isArray(P.ws.pokes.list)) ? P.ws.pokes.list : [];
      const ch = (P.api && P.api['/api/characters/me'] && P.api['/api/characters/me'].character) || {};
      const tName = ch.name || '';
      const catchLog = Array.isArray(P.catchLog) ? P.catchLog : [];
      const sessCatches = (P.sessCatches && typeof P.sessCatches === 'object') ? P.sessCatches : {};
      const unassignedLog = catchLog.slice();

      const res = [];
      for (const p of pokes) {
        if (!p) continue;
        const lv = +p.level || 0;
        const s = (p.stats && typeof p.stats === 'object') ? p.stats : p;
        const hp = +(s.hp != null ? s.hp : s.maxHp != null ? s.maxHp : s.totalHp || 0);
        const atk = +(s.atk != null ? s.atk : s.attack || 0);
        const def = +(s.def != null ? s.def : s.defense || 0);
        const spa = +(s.spa != null ? s.spa : s.spAtk != null ? s.spAtk : s.spatk != null ? s.spatk : s.specialAttack || 0);
        const spd = +(s.spd != null ? s.spd : s.spDef != null ? s.spDef : s.spdef != null ? s.spdef : s.specialDefense || 0);
        const vel = +(s.vel != null ? s.vel : s.speed || 0);
        const parsedStats = (hp > 0 && atk > 0 && def > 0 && spa > 0 && spd > 0 && vel > 0) ? { hp, atk, def, spa, spd, vel } : null;

        const pIdStr = p.id != null ? String(p.id) : '';
        const pIv = p.ivTotal != null ? Math.round(+p.ivTotal) : null;
        const pQ = +(+p.quality || 1).toFixed(2);

        let isSessionCatch = !!p._sessCatch || (pIdStr && !!sessCatches[pIdStr]);
        let catchTime = (pIdStr && sessCatches[pIdStr]) || p._catchTime || 0;

        if (!isSessionCatch && unassignedLog.length > 0) {
          const matchIdx = unassignedLog.findIndex(c => {
            if (c.id != null && String(c.id) === pIdStr) return true;
            if (c.n && (c.n.toLowerCase() === String(p.name || '').toLowerCase() || c.n === '?')) {
              const cIv = c.iv != null ? Math.round(+c.iv) : null;
              const cQ = +(+c.q || 1).toFixed(2);
              if (cIv === pIv && cQ === pQ && !!c.sh === !!p.shiny) return true;
            }
            return false;
          });
          if (matchIdx !== -1) {
            const entry = unassignedLog.splice(matchIdx, 1)[0];
            isSessionCatch = true;
            catchTime = entry.t || Date.now();
            if (pIdStr) sessCatches[pIdStr] = catchTime;
          }
        }

        res.push({
          id: pIdStr,
          name: p.name || '?',
          level: lv,
          shiny: !!p.shiny,
          quality: pQ,
          ivTotal: pIv,
          power: +p.power || 0,
          team: !!p.team,
          slot: p.slot != null ? p.slot : null,
          leader: !!p.leader,
          speciesId: +p.speciesId || +p.pokeId || 0,
          type1: p.type1 ? String(p.type1).toUpperCase() : '',
          type2: p.type2 ? String(p.type2).toUpperCase() : '',
          isDitto: !!p.isDitto,
          stats: parsedStats,
          isSessionCatch: !!isSessionCatch,
          catchTime: +catchTime || 0
        });
      }
      return { ok: true, name: tName, list: res, catchLogCount: catchLog.length, sessCaptures: (P.sess && P.sess.captures) || 0 };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  })()`;

  // Construir o inyectar modal en el DOM
  window.initPokesModal = function() {
    let ov = document.getElementById('pokesOverlay');
    if (ov && ov.querySelector('#pkPresetsBar')) return ov;
    const wasOpen = ov && ov.classList.contains('show');
    if (ov) ov.remove();

    ov = document.createElement('div');
    ov.id = 'pokesOverlay';
    if (wasOpen) ov.classList.add('show');
    ov.innerHTML = `
      <div id="pokesModal">
        <div class="pk-hd">
          <div class="pk-title">
            <svg class="ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none;color:var(--gold,#f2c665)">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
              <circle cx="12" cy="12" r="3.5" fill="var(--sf2,#1c2128)"/>
            </svg>
            <h2>Pokémon <span class="pk-badge-lv" id="pkPresetBadge">Nv 300+</span></h2>
            <span class="pk-badge-count" id="pkTotalCount">0 encontrados</span>
          </div>
          <div class="pk-hd-actions">
            <button id="pkRefreshBtn" title="Actualizar lista">↻ Actualizar</button>
            <button id="pkCloseBtn" class="pk-close-btn" title="Cerrar (Esc)">✕</button>
          </div>
        </div>

        <div class="pk-presets-bar" id="pkPresetsBar"></div>

        <div class="pk-toolbar">
          <div class="pk-search-box">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0zm-.82 4.74a6 6 0 1 0-1.06 1.06l3.79 3.79a.75.75 0 1 0 1.06-1.06l-3.79-3.79z"/>
            </svg>
            <input type="search" id="pkSearchInput" placeholder="Buscar por nombre o tipo..." autocomplete="off" spellcheck="false">
          </div>
          <div class="pk-trainer-chips" id="pkTrainerChips"></div>
          <button id="pkShinyFilter" class="pk-shiny-btn" title="Filtrar solo shiny">✨ Shiny</button>
          <span class="pk-counts" id="pkFilteredCount">Mostrando 0</span>
        </div>

        <div class="pk-table-container">
          <table class="pk-table" id="pkTable">
            <thead>
              <tr>
                <th data-sort="trainer" style="width:17%">Entrenador <span class="pk-sort-arrow"></span></th>
                <th data-sort="name" style="width:27%">Pokémon <span class="pk-sort-arrow"></span></th>
                <th data-sort="level" style="width:11%">Nivel <span class="pk-sort-arrow"></span></th>
                <th data-sort="ivTotal" style="width:16%">IVs <span class="pk-sort-arrow"></span></th>
                <th data-sort="quality" style="width:13%">Calidad <span class="pk-sort-arrow"></span></th>
                <th data-sort="power" style="width:16%">Poder <span class="pk-sort-arrow"></span></th>
              </tr>
            </thead>
            <tbody id="pkTableBody"></tbody>
          </table>
          <div id="pkLoading" class="pk-state-msg" style="display:none">
            <span class="pk-spinner"></span>
            <span>Cargando Pokémon de todas las cuentas...</span>
          </div>
          <div id="pkEmpty" class="pk-state-msg" style="display:none">
            <span>No se encontraron Pokémon con los filtros actuales.</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(ov);

    // Eventos
    const closeBtn = ov.querySelector('#pkCloseBtn');
    if (closeBtn) closeBtn.onclick = () => window.closePokesModal();

    const refreshBtn = ov.querySelector('#pkRefreshBtn');
    if (refreshBtn) refreshBtn.onclick = () => window.fetchPokes300(true);

    ov.onclick = (e) => {
      if (e.target === ov) window.closePokesModal();
    };

    const searchInput = ov.querySelector('#pkSearchInput');
    if (searchInput) {
      searchInput.oninput = (e) => {
        pokesSearchText = (e.target.value || '').trim().toLowerCase();
        pokesRenderLimit = 100;
        window.renderPokesTable();
      };
    }

    const shinyBtn = ov.querySelector('#pkShinyFilter');
    if (shinyBtn) {
      shinyBtn.onclick = () => {
        pokesShinyOnly = !pokesShinyOnly;
        pokesRenderLimit = 100;
        shinyBtn.classList.toggle('on', pokesShinyOnly);
        window.renderPokesTable();
      };
    }

    // Cabeceras de tabla ordenables
    ov.querySelectorAll('th[data-sort]').forEach(th => {
      th.onclick = () => {
        const key = th.dataset.sort;
        if (pokesSortKey === key) {
          pokesSortAsc = !pokesSortAsc;
        } else {
          pokesSortKey = key;
          pokesSortAsc = (key === 'trainer' || key === 'name');
        }
        window.renderPokesTable();
      };
    });

    return ov;
  };

  // Actualizar botones de presets y sus contadores dinámicos
  window.updatePresetPills = function() {
    const ov = document.getElementById('pokesOverlay');
    if (!ov) return;
    const bar = ov.querySelector('#pkPresetsBar');
    if (!bar) return;

    const list = window.__pokes300Data || [];
    const trainerFiltered = list.filter(pk => {
      if (pokesTrainerFilter !== 'all' && String(pk.accIdx) !== pokesTrainerFilter) return false;
      return true;
    });

    bar.innerHTML = POKES_PRESETS.map(pr => {
      const isSel = pokesPreset === pr.id;
      const count = trainerFiltered.filter(pr.test).length;
      return `<button class="pk-preset-btn${isSel ? ' on' : ''}" data-preset="${pr.id}" title="${pr.label}">
        <span>${pr.label}</span>
        <span class="pk-preset-count">${count}</span>
      </button>`;
    }).join('');

    bar.querySelectorAll('.pk-preset-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.preset;
        if (pokesPreset === id) return;
        pokesPreset = id;
        pokesRenderLimit = 100;
        const pr = POKES_PRESETS.find(p => p.id === id);
        if (pr && pr.defaultSort) {
          pokesSortKey = pr.defaultSort;
          pokesSortAsc = !!pr.defaultAsc;
        }
        window.updatePresetPills();
        window.renderPokesTable();
      };
    });
  };

  // Abrir y cerrar modal
  window.openPokesModal = function() {
    const ov = window.initPokesModal();
    ov.classList.add('show');
    const pokesBtn = document.getElementById('pokesBtn');
    if (pokesBtn) pokesBtn.classList.add('on');
    window.updatePresetPills();
    window.renderPokesTable();
    window.fetchPokes300();
  };

  window.closePokesModal = function() {
    const ov = document.getElementById('pokesOverlay');
    if (ov) ov.classList.remove('show');
    const pokesBtn = document.getElementById('pokesBtn');
    if (pokesBtn) pokesBtn.classList.remove('on');
  };

  // Consultar todas las cuentas conectadas
  window.fetchPokes300 = async function(force = false) {
    if (pokesIsLoading) return;
    pokesIsLoading = true;

    const ov = window.initPokesModal();
    const loadingEl = ov.querySelector('#pkLoading');
    const emptyEl = ov.querySelector('#pkEmpty');
    const tbody = ov.querySelector('#pkTableBody');

    if (!window.__pokes300Data.length || force) {
      if (loadingEl) loadingEl.style.display = 'flex';
      if (emptyEl) emptyEl.style.display = 'none';
      if (tbody && !window.__pokes300Data.length) tbody.innerHTML = '';
    }

    // Obtener información del estado global de PokeGrid
    const state = typeof window.pgGetState === 'function' ? window.pgGetState() : {};
    const webviews = state.webviews || Array.from(document.querySelectorAll('webview'));
    const off = state.off || [false, false, false, false];
    const stCache = state.stCache || {};
    const tabNames = state.tabNames || [];
    const ACOR = state.ACOR || ['#c07bf5', '#3987e5', '#1baf7a', '#eda100'];

    const allPokes = [];
    const activeTrainers = [];

    // Pre-cargar base stats de criaturas en paralelo
    window.ensureCreaturesBaseStats().catch(() => {});

    const promises = webviews.map(async (wv, idx) => {
      if (!wv || off[idx]) return null;
      const dot = ACOR[idx] || '#8b949e';
      const fallbackName = tabNames[idx] || (stCache[idx] && stCache[idx].d && stCache[idx].d.name) || ('C' + (idx + 1));

      try {
        const res = await wv.executeJavaScript(POKES_LV300_QUERY);
        const trainerName = (res && res.name) || fallbackName;
        activeTrainers.push({ idx, name: trainerName, dot });

        if (res && res.ok && Array.isArray(res.list)) {
          res.list.forEach(pk => {
            allPokes.push({
              accIdx: idx,
              trainerName,
              dotColor: dot,
              ...pk
            });
          });
        }
      } catch (e) {
        activeTrainers.push({ idx, name: fallbackName, dot });
      }

      // Si el webview no devolvió lista pero hay equipo en stCache, incluirlo
      const team = (stCache[idx] && stCache[idx].d && Array.isArray(stCache[idx].d.team)) ? stCache[idx].d.team : [];
      team.forEach(tp => {
        if (tp) {
          const already = allPokes.some(x => x.accIdx === idx && (x.id === tp.id || (x.name === tp.name && x.level === tp.level)));
          if (!already) {
            allPokes.push({
              accIdx: idx,
              trainerName: fallbackName,
              dotColor: dot,
              id: tp.id || '',
              name: tp.name || '?',
              level: +tp.level || 1,
              shiny: !!tp.shiny,
              quality: +(+tp.q || 1).toFixed(2),
              ivTotal: tp.ivt != null ? Math.round(+tp.ivt) : null,
              power: +tp.pw || 0,
              team: true,
              slot: tp.slot != null ? tp.slot : null,
              leader: !!tp.ld,
              speciesId: +tp.sid || 0,
              type1: tp.t1 ? String(tp.t1).toUpperCase() : '',
              type2: tp.t2 ? String(tp.t2).toUpperCase() : '',
              isDitto: !!tp.dt,
              stats: null
            });
          }
        }
      });
    });

    try {
      await Promise.all(promises);
      window.__pokes300Data = allPokes;
      window.__pokesTrainers = activeTrainers.sort((a, b) => a.idx - b.idx);
    } catch {}

    pokesIsLoading = false;
    if (loadingEl) loadingEl.style.display = 'none';

    window.updateTrainerChips();
    window.updatePresetPills();
    window.renderPokesTable();
  };

  // Actualizar chips de entrenadores
  window.updateTrainerChips = function() {
    const ov = document.getElementById('pokesOverlay');
    if (!ov) return;
    const container = ov.querySelector('#pkTrainerChips');
    if (!container) return;

    const trainers = window.__pokesTrainers || [];
    let html = '<button class="pk-chip' + (pokesTrainerFilter === 'all' ? ' on' : '') + '" data-acc="all">Todos</button>';

    trainers.forEach(tr => {
      const isSel = pokesTrainerFilter === String(tr.idx);
      html += '<button class="pk-chip' + (isSel ? ' on' : '') + '" data-acc="' + tr.idx + '">'
        + '<span class="pk-chip-dot" style="background:' + tr.dot + '"></span>'
        + '<span>' + (tr.name || ('C' + (tr.idx + 1))) + '</span>'
        + '</button>';
    });

    container.innerHTML = html;

    container.querySelectorAll('.pk-chip').forEach(chip => {
      chip.onclick = () => {
        pokesTrainerFilter = chip.dataset.acc;
        pokesRenderLimit = 100;
        window.updateTrainerChips();
        window.updatePresetPills();
        window.renderPokesTable();
      };
    });
  };

  // Renderizar la tabla con filtros y ordenación
  window.renderPokesTable = function() {
    const ov = document.getElementById('pokesOverlay');
    if (!ov) return;

    const tbody = ov.querySelector('#pkTableBody');
    const totalCountEl = ov.querySelector('#pkTotalCount');
    const filteredCountEl = ov.querySelector('#pkFilteredCount');
    const emptyEl = ov.querySelector('#pkEmpty');
    const loadingEl = ov.querySelector('#pkLoading');

    if (!tbody) return;

    const list = window.__pokes300Data || [];
    if (totalCountEl) totalCountEl.textContent = list.length + ' encontrados';

    const curPreset = POKES_PRESETS.find(p => p.id === pokesPreset) || POKES_PRESETS[0];
    const badgeEl = ov.querySelector('#pkPresetBadge');
    if (badgeEl) badgeEl.textContent = curPreset.badge;

    // Filtrar
    const filtered = list.filter(pk => {
      if (pokesTrainerFilter !== 'all' && String(pk.accIdx) !== pokesTrainerFilter) return false;
      if (!curPreset.test(pk)) return false;
      if (pokesShinyOnly && !pk.shiny) return false;
      if (pokesSearchText) {
        const nm = String(pk.name || '').toLowerCase();
        const t1 = String(pk.type1 || '').toLowerCase();
        const t2 = String(pk.type2 || '').toLowerCase();
        if (!nm.includes(pokesSearchText) && !t1.includes(pokesSearchText) && !t2.includes(pokesSearchText)) {
          return false;
        }
      }
      return true;
    });

    // Ordenar
    filtered.sort((a, b) => {
      if (pokesSortKey === 'catchTime') {
        const ctA = +a.catchTime || 0;
        const ctB = +b.catchTime || 0;
        if (ctA !== ctB) return pokesSortAsc ? ctA - ctB : ctB - ctA;
        return (b.level || 0) - (a.level || 0);
      }

      if (pokesSortKey === 'trainer') {
        const trA = (a.accIdx != null ? a.accIdx : 99);
        const trB = (b.accIdx != null ? b.accIdx : 99);
        if (trA !== trB) return pokesSortAsc ? trA - trB : trB - trA;
        if (a.team && b.team) {
          const sA = a.slot != null ? a.slot : (a.leader ? 0 : 99);
          const sB = b.slot != null ? b.slot : (b.leader ? 0 : 99);
          if (sA !== sB) return pokesSortAsc ? sA - sB : sB - sA;
        }
        return (b.level || 0) - (a.level || 0);
      }

      let va = a[pokesSortKey];
      let vb = b[pokesSortKey];

      if (pokesSortKey === 'name') {
        va = String(a.name || '').toLowerCase();
        vb = String(b.name || '').toLowerCase();
      } else {
        va = va != null ? +va : -Infinity;
        vb = vb != null ? +vb : -Infinity;
      }

      if (va < vb) return pokesSortAsc ? -1 : 1;
      if (va > vb) return pokesSortAsc ? 1 : -1;
      return (b.level || 0) - (a.level || 0);
    });

    // Actualizar indicadores de cabecera
    ov.querySelectorAll('th[data-sort]').forEach(th => {
      const isAct = th.dataset.sort === pokesSortKey;
      th.classList.toggle('active-sort', isAct);
      const arrow = th.querySelector('.pk-sort-arrow');
      if (arrow) {
        arrow.textContent = isAct ? (pokesSortAsc ? '▲' : '▼') : '';
      }
    });

    if (filteredCountEl) {
      filteredCountEl.textContent = 'Mostrando ' + Math.min(filtered.length, pokesRenderLimit) + ' de ' + filtered.length + ' (' + list.length + ' total)';
    }

    if (!filtered.length) {
      tbody.innerHTML = '';
      if (emptyEl && (!loadingEl || loadingEl.style.display === 'none')) {
        emptyEl.style.display = 'flex';
      }
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    // Lista visible con paginación progresiva para mantener respuesta instantánea
    const visibleList = filtered.slice(0, pokesRenderLimit);
    const hasMore = filtered.length > pokesRenderLimit;

    // Generar filas
    let rowsHtml = visibleList.map((pk, idx) => {
      const spriteUrl = pk.speciesId ? ('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + (pk.shiny ? 'shiny/' : '') + pk.speciesId + '.png') : '';
      const fallbackSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b949e" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><circle cx="12" cy="12" r="3.5"/></svg>';
      const spriteImg = spriteUrl ? ('<img src="' + spriteUrl + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';"><span style="display:none">' + fallbackSvg + '</span>') : fallbackSvg;

      const typesHtml = [pk.type1, pk.type2].filter(Boolean).map(ty => {
        const bg = TIPO_COR[ty.toLowerCase()] || '#6e7681';
        return '<span class="pk-type-pill" style="background:' + bg + '">' + ty + '</span>';
      }).join('');

      const raro = RARO_INFO(pk.quality || 1);
      const ivPct = pk.ivTotal != null ? Math.round((pk.ivTotal / 192) * 100) : null;
      const ivColor = ivPct != null ? POT_COR(ivPct) : '#8b949e';

      const nf = (n) => (n == null ? '–' : Math.round(n).toLocaleString('pt-BR'));

      const teamBadge = pk.leader
        ? '<span class="pk-team-badge" style="background:rgba(242,198,101,.18);color:var(--gold,#f2c665);border-color:rgba(242,198,101,.35);font-weight:700">⚔️ Líder</span>'
        : pk.team
          ? '<span class="pk-team-badge">Equipo' + (pk.slot != null ? ' #' + (+pk.slot + 1) : '') + '</span>'
          : '';

      return `
        <tr class="pk-row" data-pk-idx="${idx}">
          <td>
            <div class="pk-cell-trainer">
              <span class="pk-chip-dot" style="background:${pk.dotColor}"></span>
              <span>${pk.trainerName}</span>
            </div>
          </td>
          <td>
            <div class="pk-cell-poke">
              <div class="pk-sprite-wrap">${spriteImg}</div>
              <div class="pk-poke-info">
                <div class="pk-poke-name-row">
                  <span class="pk-poke-name">${pk.name}</span>
                  ${pk.shiny ? '<span class="pk-shiny-badge" title="Shiny">✨</span>' : ''}
                  ${teamBadge}
                  ${pk.isSessionCatch ? '<span class="pk-team-badge" style="background:rgba(57,135,229,.18);color:#58a6ff;border-color:rgba(57,135,229,.35);font-weight:600" title="' + (pk.catchTime ? 'Capturado en esta sesión (' + new Date(pk.catchTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) + ')' : 'Capturado en esta sesión') + '">🎯 Captura' + (pk.catchTime ? ' ' + new Date(pk.catchTime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '') + '</span>' : ''}
                </div>
                <div class="pk-types-row">${typesHtml}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="pk-lv-badge">Nv. ${pk.level}</span>
          </td>
          <td>
            <div class="pk-iv-cell">
              <div class="pk-iv-text" style="color:${ivColor}">
                <span>${pk.ivTotal != null ? pk.ivTotal + '/192' : '?/192'}</span>
                ${ivPct != null ? '<span style="font-size:11px;opacity:.9">(' + ivPct + '%)</span>' : ''}
              </div>
              ${ivPct != null ? '<div class="pk-iv-bar"><div class="pk-iv-bar-fill" style="width:' + ivPct + '%;background:' + ivColor + '"></div></div>' : ''}
            </div>
          </td>
          <td>
            <div class="pk-qual-cell">
              <span class="pk-qual-num" style="color:${raro[1]}">×${(+pk.quality || 1).toFixed(2)}</span>
              <span class="pk-qual-raro" style="color:${raro[1]}">${raro[0]}</span>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <span class="pk-pw-cell">${pk.power ? nf(pk.power) : '–'}</span>
              <button class="pk-btn-ver">Ver IVs</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (hasMore) {
      rowsHtml += `
        <tr class="pk-load-more-row">
          <td colspan="6" style="text-align:center;padding:12px 16px;background:rgba(0,0,0,0.15)">
            <button class="pk-load-more-btn" id="pkLoadMoreBtn">Cargar más (+100) — Mostrando ${visibleList.length} de ${filtered.length}</button>
          </td>
        </tr>
      `;
    }

    tbody.innerHTML = rowsHtml;

    // Asignar clic para cargar más
    const loadMoreBtn = tbody.querySelector('#pkLoadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.onclick = () => {
        pokesRenderLimit += 100;
        window.renderPokesTable();
      };
    }

    // Asignar clic para abrir el modal de IVs
    tbody.querySelectorAll('.pk-row').forEach(row => {
      row.onclick = () => {
        const pkIdx = +row.dataset.pkIdx;
        const pk = visibleList[pkIdx];
        if (pk) {
          window.openPokemonIv(pk, pk.accIdx);
        }
      };
    });
  };


  // Pre-cargar base stats de todas las criaturas desde creatures.json a través de cualquier webview activo o del estado
  window.ensureCreaturesBaseStats = async function() {
    if (window.__creaturesBases && Object.keys(window.__creaturesBases).length > 0) {
      return window.__creaturesBases;
    }
    const state = typeof window.pgGetState === 'function' ? window.pgGetState() : {};
    if (state.basesByName && Object.keys(state.basesByName).length > 0) {
      window.__creaturesBases = state.basesByName;
      return window.__creaturesBases;
    }
    if (window.basesByName && Object.keys(window.basesByName).length > 0) {
      window.__creaturesBases = window.basesByName;
      return window.__creaturesBases;
    }

    const webviews = Array.from(document.querySelectorAll('webview'));
    for (const wv of webviews) {
      try {
        const bs = await wv.executeJavaScript(`(async () => {
          try {
            if (window.__pgCreaturesBs) return window.__pgCreaturesBs;
            const r = await fetch('/game/creatures.json');
            const data = await r.json();
            const bs = {};
            ((data && data.creatures) || []).forEach(c => {
              if (c && c.name) {
                const k = String(c.name).toLowerCase();
                if (bs[k] && !c.area && +c.pokeId >= 10000) return;
                bs[k] = [+c.baseHp || 0, +c.baseAtk || 0, +c.baseDef || 0, +c.baseSpAtk || 0, +c.baseSpDef || 0, +c.baseSpeed || 0];
              }
            });
            window.__pgCreaturesBs = bs;
            return bs;
          } catch (e) {
            return null;
          }
        })()`);
        if (bs && Object.keys(bs).length > 0) {
          window.__creaturesBases = bs;
          if (typeof window.basesByName === 'undefined' || !Object.keys(window.basesByName || {}).length) {
            window.basesByName = bs;
          }
          return bs;
        }
      } catch (e) {}
    }
    return window.__creaturesBases || {};
  };

  // Definición o polyfill de pgOpenIv en el contexto global
  if (typeof window.pgOpenIv !== 'function') {
    window.pgOpenIv = function(payload, accIdx) {
      const lockBtn = document.querySelector('#ivCard button[data-a="trava"].on');
      if (lockBtn) lockBtn.click();
      if (typeof window.ivRecebe === 'function') {
        window.ivRecebe(accIdx != null ? accIdx : 0, payload);
      }
      const ivCard = document.getElementById('ivCard');
      if (ivCard && !ivCard.classList.contains('show')) {
        const ivsBtn = document.getElementById('ivsBtn');
        if (ivsBtn) ivsBtn.click();
      } else if (typeof window.ivRender === 'function') {
        window.ivRender();
      }
    };
  }

  // Abrir #ivCard con ese Pokémon seleccionado
  window.openPokemonIv = async function(pk, accIdx) {
    if (!pk) return;
    try {
      const bases = await window.ensureCreaturesBaseStats();
      const sp = String(pk.name || '').toLowerCase().trim();
      const b = (bases && bases[sp]) || (window.basesByName && window.basesByName[sp]);

      let stats = pk.stats;
      let power = pk.power;
      const lvl = Math.max(1, Math.min(9999, Math.round(+pk.level || 1)));
      const qual = +pk.quality > 0 ? +pk.quality : 1;
      const ivTot = pk.ivTotal != null ? Math.max(0, Math.min(192, Math.round(+pk.ivTotal))) : null;

      // Verificar si tenemos estadísticas completas y válidas (los 6 atributos > 0)
      const hasAllStats = stats &&
        +stats.hp > 0 &&
        +stats.atk > 0 &&
        +stats.def > 0 &&
        +stats.spa > 0 &&
        +stats.spd > 0 &&
        +(stats.vel != null ? stats.vel : stats.speed) > 0;

      const baseObj = b ? { hp: b[0], atk: b[1], def: b[2], spa: b[3], spd: b[4], speed: b[5] } : null;
      let statsAreObserved = false;

      // Si los 6 stats estaban presentes, comprobar si cierran con normalizeIvs
      if (hasAllStats && baseObj && window.PokeGridIvMath) {
        try {
          const testIv = window.PokeGridIvMath.normalizeIvs({
            level: lvl,
            quality: qual,
            ivTotal: ivTot,
            power: Math.round(+power || 0),
            observedStats: {
              hp: Math.round(+stats.hp),
              atk: Math.round(+stats.atk),
              def: Math.round(+stats.def),
              spa: Math.round(+stats.spa),
              spd: Math.round(+stats.spd),
              speed: Math.round(+(stats.vel != null ? stats.vel : stats.speed))
            },
            species: { baseStats: baseObj }
          });
          if (testIv && /^observed/.test(testIv.source)) {
            statsAreObserved = true;
          }
        } catch (e) {}
      }

      // Si no están completos o no cierran de forma exacta, proyectar stats teóricos congruentes con ivTotal
      if (!statsAreObserved && baseObj && window.PokeGridIvMath) {
        try {
          const proj = window.PokeGridIvMath.projectPokemon({
            level: lvl,
            quality: qual,
            ivTotal: ivTot != null ? ivTot : 96,
            species: { baseStats: baseObj }
          }, lvl);
          if (proj && proj.stats) {
            stats = {
              hp: Math.round(proj.stats.hp),
              atk: Math.round(proj.stats.atk),
              def: Math.round(proj.stats.def),
              spa: Math.round(proj.stats.spa),
              spd: Math.round(proj.stats.spd),
              vel: Math.round(proj.stats.speed)
            };
            if (!power) power = proj.power;
          }
        } catch (e) {}
      }

      if (!stats || !stats.hp) {
        const fallbackVal = Math.round(100 + (lvl * 15));
        stats = {
          hp: fallbackVal,
          atk: fallbackVal,
          def: fallbackVal,
          spa: fallbackVal,
          spd: fallbackVal,
          vel: fallbackVal
        };
      }

      const state = typeof window.pgGetState === 'function' ? window.pgGetState() : {};
      const moves = state.movesByName || window.movesByName || {};
      const rawTipos = pk.type1
        ? [pk.type1, pk.type2].filter(Boolean)
        : (moves[sp] && moves[sp].t) || [];
      const tipos = rawTipos
        .map(x => String(x).toUpperCase())
        .filter(x => Object.hasOwn(TIPO_COR, x.toLowerCase()))
        .slice(0, 2);

      const saneStats = {
        hp: Math.max(0, Math.min(1000000, Math.round(+stats.hp || 0))),
        atk: Math.max(0, Math.min(1000000, Math.round(+stats.atk || 0))),
        def: Math.max(0, Math.min(1000000, Math.round(+stats.def || 0))),
        spa: Math.max(0, Math.min(1000000, Math.round(+stats.spa || 0))),
        spd: Math.max(0, Math.min(1000000, Math.round(+stats.spd || 0))),
        vel: Math.max(0, Math.min(1000000, Math.round(+(stats.vel != null ? stats.vel : stats.speed) || 0)))
      };

      const payload = {
        nome: String(pk.name || '').trim(),
        shiny: !!pk.shiny,
        ditto: !!pk.isDitto,
        ativo: false,
        time: !!pk.team,
        tipos,
        nivel: lvl,
        qualidade: qual,
        ivTotal: ivTot,
        stats: saneStats,
        poder: Math.max(0, Math.min(1000000000, Math.round(+power || 0))),
        fonte: 'tooltip'
      };

      // Si la card de IVs estaba bloqueada con el candado, desbloquear
      const lockBtn = document.querySelector('#ivCard button[data-a="trava"].on');
      if (lockBtn) lockBtn.click();

      // Limpiar búsqueda en card de IV si la hubiera
      const ivBusca = document.getElementById('ivBusca');
      if (ivBusca && ivBusca.value) {
        ivBusca.value = '';
        ivBusca.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const acc = accIdx != null ? accIdx : 0;

      // 1. Invocar pgOpenIv (o el polyfill definido arriba)
      if (typeof window.pgOpenIv === 'function') {
        window.pgOpenIv(payload, acc);
      } else if (typeof window.ivRecebe === 'function') {
        // 2. Invocar directamente ivRecebe nativo en el renderer
        window.ivRecebe(acc, payload);
        const ivCard = document.getElementById('ivCard');
        if (ivCard && !ivCard.classList.contains('show')) {
          const ivsBtn = document.getElementById('ivsBtn');
          if (ivsBtn) ivsBtn.click();
        } else if (typeof window.ivRender === 'function') {
          window.ivRender();
        }
      }

      // Asegurar pestaña de leitor activa
      setTimeout(() => {
        const leitorTab = document.querySelector('#ivCard .iv-aba[data-v="leitor"]:not(.on)');
        if (leitorTab) leitorTab.click();
      }, 30);
    } catch (err) {
      console.error('Error al abrir IV de Pokémon:', err);
    }
  };

  // Botón en la barra superior (topbar)
  window.mountPokesButton = function() {
    const topbar = document.getElementById('topbar');
    if (!topbar) return;

    let btn = document.getElementById('pokesBtn');
    if (btn) {
      btn.title = 'Pokémon\nVer Pokémon de todas las cuentas con filtros rápidos (Nv 300+, En Equipo, IV 160+, Épicas, Dittos, etc.)';
      btn.onclick = () => {
        const ov = document.getElementById('pokesOverlay');
        if (ov && ov.classList.contains('show')) {
          window.closePokesModal();
        } else {
          window.openPokesModal();
        }
      };
      return;
    }

    const target = document.getElementById('ocBtn') || document.getElementById('ivsBtn');
    btn = document.createElement('button');
    btn.id = 'pokesBtn';
    btn.title = 'Pokémon\nVer Pokémon de todas las cuentas con filtros rápidos (Nv 300+, En Equipo, IV 160+, Épicas, Dittos, etc.)';
    btn.setAttribute('aria-label', 'Pokémon');
    btn.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:6px 10px;font-size:12px;font-weight:600;background:transparent;border:1px solid transparent;border-radius:6px;color:#c9d1d9;cursor:pointer;white-space:nowrap;transition:background .15s ease,border-color .15s ease,color .15s ease;';

    const pokeSvg = '<svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><circle cx="12" cy="12" r="3.5" fill="var(--sf2, #161b22)"/></svg>';
    btn.innerHTML = pokeSvg + '<span class="lbl">Pokémon</span>';

    btn.onmouseenter = () => {
      if (!btn.classList.contains('on')) {
        btn.style.background = 'var(--bd, #21262d)';
        btn.style.borderColor = 'var(--bd2, #30363d)';
        btn.style.color = 'var(--tx, #e6edf3)';
      }
    };
    btn.onmouseleave = () => {
      if (!btn.classList.contains('on')) {
        btn.style.background = 'transparent';
        btn.style.borderColor = 'transparent';
        btn.style.color = '#c9d1d9';
      }
    };
    btn.onclick = () => {
      const ov = document.getElementById('pokesOverlay');
      if (ov && ov.classList.contains('show')) {
        window.closePokesModal();
      } else {
        window.openPokesMconst setupReloadUi = function() {
    const btn = document.getElementById('reloadUi');
    if (btn && !btn.__customReloadBound) {
      btn.__customReloadBound = true;
      btn.onclick = (e) => {
        if (e && e.shiftKey) {
          location.reload();
          return;
        }
        btn.disabled = true;
        const origText = btn.textContent;
        btn.textContent = 'Refrescando…';
        try {
          const oldScript = document.getElementById('pgCustomScript');
          if (oldScript) oldScript.remove();
          const oldPokes = document.getElementById('pokesOverlay');
          if (oldPokes) oldPokes.remove();

          window.CUSTOM_COLUMNS = true;
          window.enhanceTableCard = () => {};

          const finishReload = () => {
            btn.disabled = false;
            btn.textContent = origText;
            if (typeof cardsOn !== 'undefined' && cardsOn && typeof refreshCards === 'function') {
              if (typeof cdHtmlAnt !== 'undefined') cdHtmlAnt = '';
              refreshCards(true);
            }
            if (typeof refreshStats === 'function') refreshStats();
            if (typeof window.mountPokesButton === 'function') window.mountPokesButton();
            if (typeof window.enhanceInvCard === 'function') window.enhanceInvCard();
          };

          const s = document.createElement('script');
          s.id = 'pgCustomScript';
          s.src = 'src/custom-ui.js?_t=' + Date.now();
          s.onload = finishReload;
          s.onerror = () => {
            const s2 = document.createElement('script');
            s2.id = 'pgCustomScript';
            s2.src = 'src/custom-ui.js';
            s2.onload = finishReload;
            s2.onerror = () => {
              btn.disabled = false;
              btn.textContent = origText;
            };
            document.body.appendChild(s2);
          };
          document.body.appendChild(s);
        } catch (err) {
          btn.disabled = false;
          btn.textContent = origText;
          console.error('Error al refrescar UI:', err);
        }
      };
    }
  };

  // Tecla Escape cierra modal de Pokémon si está abierto
      };
            document.body.appendChild(s2);
          };
          document.body.appendChild(s);
        } catch (err) {
          console.error('Error al refrescar UI:', err);
        }
      };
    }
  };

  // Tecla Escape cierra modal de Pokémon si está abierto
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const ov = document.getElementById('pokesOverlay');
      if (ov && ov.classList.contains('show')) {
        window.closePokesModal();
      }
    }
  });

  // Reconstruir overlay viejo si existe en el DOM
  try {
    const existingPokesOv = document.getElementById('pokesOverlay');
    if (existingPokesOv && !existingPokesOv.querySelector('#pkPresetsBar')) {
      const wasOpen = existingPokesOv.classList.contains('show');
      existingPokesOv.remove();
      const freshOv = window.initPokesModal();
      if (wasOpen) {
        freshOv.classList.add('show');
        window.updatePresetPills();
        window.renderPokesTable();
      }
    }
  } catch {}

  // Ejecución inicial y observación de cambios en el contenedor de cards y topbar
  setTimeout(() => {
    window.mountPokesButton();
    window.enhanceInvCard();
    setupReloadUi();

    const cards = document.getElementById('cards');
    if (cards && !window.__cardsInvObserver) {
      window.__cardsInvObserver = new MutationObserver(() => {
        if (!isEnhancing) window.enhanceInvCard();
      });
      window.__cardsInvObserver.observe(cards, { childList: true, subtree: true });
    }

    const topbar = document.getElementById('topbar');
    if (topbar && !window.__topbarPokesObserver) {
      window.__topbarPokesObserver = new MutationObserver(() => {
        window.mountPokesButton();
        setupReloadUi();
      });
      window.__topbarPokesObserver.observe(topbar, { childList: true });
    }
  }, 50);
})();

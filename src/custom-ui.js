// src/custom-ui.js - Extensión de UI en vivo para PokeGrid (recarga sin reiniciar juegos)
(function() {
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

  window.setCustomStyle = function(css) {
    let el = document.getElementById('pgCustomStyle');
    if (!el) {
      el = document.createElement('style');
      el.id = 'pgCustomStyle';
      document.head.appendChild(el);
    }
    el.textContent = css || '';
  };
})();

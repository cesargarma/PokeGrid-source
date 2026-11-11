<div align="center">

<img src="tray.png" width="72" alt="PokeGrid">

# PokeGrid

**Four Poke Idle World accounts in a single window.**

![Platform](https://img.shields.io/badge/Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-0078D6)
![Electron](https://img.shields.io/badge/Electron-43-47848F)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[Português](README.md)

<img src="docs/modo-simples.png" width="880" alt="Simple mode: dashboard with the numbers of all four accounts">

<sub>Simple mode: hides the game and shows only the numbers. Every section can be moved and resized.</sub>

</div>

> This is the run-from-source version. There is no ready-made executable to download: you grab the code, look at what it does and run it yourself. That way the trust is on you, not on me.

> ### 🔒 Your login data stays only on your computer
> Login and password are encrypted on your own PC and never leave it. No server, no repository. The whole code is here for you to check.

## What it is

Four accounts running at once, each in its own quadrant with a separate session. You save the login once and the app signs in on its own from then on. If a session drops mid farm, it logs back in without you being around. It does not automate the game or touch the captcha, it only organizes the accounts you already have.


## 🚀 Exclusive New Features & Enhancements

This custom version incorporates powerful analytical tools, advanced simulators, and quality-of-life (QoL) improvements designed to elevate multi-account gameplay:

---

### 1. ⚔️ Boss Simulator & Team Optimizer
Simulates full battles against world bosses (**Giant Cruel**, **Ancient Aero**, and future bosses) with mathematical precision.

<img src="docs/simulador-bosses.jpg" width="880" alt="Boss Simulator and Team Optimizer">

- **Accurate Combat Simulation**: Accurately models damage per hit, attack cadence, survival endurance of each Pokémon, and total team survival time.
- **Ergonomic Two-Column Layout**:
  - **Configuration Sidebar**: Scope selection ("All accounts" Global mode or individual trainer), dynamic Clan Bonus selector (+15% ATK) with official elemental affinities (Orebound, Seavell, Psycraft, Malefic, Naturia, etc.), and official Held Item badges.
  - **Main Combat Dashboard**: Battle outcome banner (Victory or Defeat with boss remaining HP), segmented multi-color health bar, and 1 Pokémon per row display with 2x2 combat metrics and rightmost prominent % boss damage box.
- **Official Held Items Calibrated by Tiers**: Full calibration of official game Held Item tiers (Tiers 1 to 8 for X-Attack, X-Defense, X-Vitality, X-Boost, Critical, Block, Experience, and Lucky).
- **Automatic Team Optimization**: Analyzes all Pokémon across all your accounts and automatically suggests the optimal 6-member team.

---

### 2. 🔍 Global Multi-Account Pokémon Explorer
A unified modal dashboard to inspect and search all Pokémon across all connected accounts.

<img src="docs/explorador-pokemon.jpg" width="880" alt="Global Multi-Account Pokémon Explorer">

- **Instant Preset Filters with Live Counts**:
  - `Lv 300+`: Quick access to high-level Pokémon.
  - `Catches (Session)`: Pokémon caught during the active session.
  - `In Team`: All Pokémon currently assigned to combat teams.
  - `IV 160+`: High IV Pokémon.
  - `All`: Complete census across all accounts.
- **Combined Advanced Filters**: Filter by name or elemental type, IV ranges (Min - Max), Quality multiplier ranges, Shiny toggle ✨, and specific trainer selector.
- **Weighted Total Power Formula**: Calculates effective power index combining level, IVs, and quality/rarity multiplier.
- **Instant IV Inspection**: One-click modal to inspect detailed IV distribution and stats.

---

### 3. 📊 % EXP Progress & Real-Time Lvl Up Estimation
See exact level progress and remaining time for each account's team leader.

<img src="docs/lvlup-exp-progress.png" width="880" alt="EXP Progress and Estimated Lvl Up Time">

- **% EXP**: Exact percentage accumulated in the current level with an integrated visual progress bar.
- **Lvl Up**: Real-time smart time projection (`2h 41m`, `2d 15h`) calculated dynamically from the active hunt's XP/h rate.

---

### 4. ⭐ Global Inventory with Pinned Favorites & Live Search
Unified inventory aggregating bag and depot resources from all active accounts.

<img src="docs/inventario-global-favoritos.png" width="880" alt="Global Inventory with Pinned Favorites and Search">

- **Persistent Favorites**: Click the star `☆` on any item to pin it to the top with a gold `★`, keeping it visible regardless of quantity or sort order.
- **Visual Divider Bar**: Clean separator between pinned favorites and search results or other items.
- **Real-Time Search**: Instant filtering while typing without resets during automatic card refresh ticks.

---

### 5. 🎒 Modular Consumables, Currency & VIP Card
Compact overview of essential resources per account without needing to switch windows.

<img src="docs/consumibles-multicuenta.png" width="880" alt="Modular Consumables Card">

- **Pokéballs**: Live count per account of Ultra Balls, Idle Balls, and others.
- **Potions**: Stock of Ultra Potions and healing items.
- **Currencies**: Accumulated Gold ($) and Diamonds per account.
- **VIP Status & Time**: Badge displaying active VIP membership and exact remaining time (`VIP · 35d 22h`).

---

### 6. ⚡ Topbar Shortcuts & Hot UI Reload
Smooth navigation without interrupting running game sessions.

<img src="docs/topbar-modulos.png" width="880" alt="Topbar Shortcut Buttons">

- **Topbar Module Buttons**: Direct buttons for **Pokémon** and **Bosses ⚔️** with quick `Escape` key close support.
- **Hot Reload UI Button**: Refresh visual enhancements and scripts in live mode without reloading `<webview>` panels.

---

## How to run

You need Node.js installed once. After that it is quick.

**1. Install Node.js**
Download the LTS version at [nodejs.org](https://nodejs.org) and install it (just next, next, finish).

**2. Download this code**
Click the green **Code** button above, then **Download ZIP**. Extract the folder wherever you want. If you use Git, clone it:

```bash
git clone https://github.com/soufoka/PokeGrid-source.git
```

**3. Open the app**
On Windows, double click **Abrir PokeGrid** (`.bat`) in the folder. The first time it installs what it needs in a black window and opens the app; after that the window just flashes and the app opens right away. Want a shortcut? Right click it, **Send to: Desktop (create shortcut)**.

You can also use **iniciar.bat**, but it keeps a black window open and closing that window closes the app.

On macOS or Linux, open a terminal in the folder and run:

```bash
bash iniciar.sh
```

That is it. Log in or create an account in each panel and, under "Treinadores" (Accounts), save the login. Next time it signs in on its own.

## Documentation

| | |
|---|---|
| **[Manual](MANUAL.md)** | What every button and panel section does (Portuguese) |
| **[FAQ](FAQ.md)** | Common questions: updating without losing anything, the missing pokéball, scripts, spreadsheets |
| **[Tutorial](TUTORIAL.md)** | Step by step for the no-installer version |
| **[Changelog](CHANGELOG.md)** | What landed in each version |

## What it does

- Run 1 to 4 accounts, you choose how many panels to open.
- Auto login, even when the session expires in the middle of a farm.
- Eco mode that keeps CPU use down without hurting progress.
- Hides the chat and the game icon menu to free up screen.
- Alerts on shiny, dropped account, stopped farming and low supplies, on Windows and on Discord.
- Turn each panel on or off, zoom, full screen and keyboard shortcuts.
- Tray, start with Windows, and Portuguese, English or Spanish.

## Security

- Passwords are encrypted by Electron's `safeStorage`, which uses the OS API (DPAPI on Windows). They never leave the PC.
- Panels are locked to the game's domain. An external link opens in your real browser, and the password is only typed into the official login page.
- The game's camera, microphone, location and notifications are blocked.
- You always solve the captcha. The app fills the fields and presses Enter when you tick the box, but it never touches the "Confirm you are human" widget. Beating bot detection is not the point.

## Under the hood

Each panel is an Electron `<webview>` with its own partition (`persist:conta1` to `conta4`), and that is what keeps the accounts isolated and logged in between launches. Whatever the game does not offer, the app injects into each panel: Eco swaps `requestAnimationFrame` for a slower version, the login fills through the input's native setter, and the menu and chat disappear via CSS with a `MutationObserver`. It is all in `main.js`, `preload.js` and `index.html`, nothing hidden.

## License

MIT. Independent project, not affiliated with Poke Idle World.
